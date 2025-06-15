
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CREWAI_API_URL = 'https://api.crewai.com/v1/analyze-blood-report'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { fileUrl, testId } = await req.json()

    if (!fileUrl || !testId) {
      throw new Error('File URL and test ID are required')
    }

    // Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('lab-reports')
      .download(fileUrl)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    // Convert file to base64 for API call
    const arrayBuffer = await fileData.arrayBuffer()
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Call CrewAI API for blood report analysis
    const analysisResponse = await fetch(CREWAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('CREWAI_API_KEY')}`,
      },
      body: JSON.stringify({
        file_data: base64Data,
        file_type: 'pdf', // Assuming PDF reports
        analysis_type: 'comprehensive',
        include_recommendations: true,
        language: 'en' // Can be made dynamic based on user preference
      }),
    })

    if (!analysisResponse.ok) {
      throw new Error(`CrewAI API error: ${analysisResponse.statusText}`)
    }

    const analysisResult = await analysisResponse.json()

    // Update the lab test record with analysis results
    const { error: updateError } = await supabaseClient
      .from('lab_tests')
      .update({
        analysis_result: analysisResult,
        status: 'completed'
      })
      .eq('id', testId)
      .eq('user_id', user.id)

    if (updateError) {
      throw new Error(`Failed to update test record: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        message: 'Blood report analyzed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error analyzing blood report:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze blood report',
        success: false 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
