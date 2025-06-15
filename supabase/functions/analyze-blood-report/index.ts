
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    console.log('Starting blood report analysis for test:', testId)

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

    console.log('File downloaded and converted to base64, calling CrewAI API...')

    // Call CrewAI API for blood report analysis using Groq
    const analysisResponse = await fetch('https://api.crewai.com/v1/crews/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('CREWAI_API_KEY')}`,
      },
      body: JSON.stringify({
        crew_id: 'blood-test-analyzer',
        inputs: {
          report_data: base64Data,
          file_type: 'pdf',
          analysis_type: 'comprehensive'
        }
      }),
    })

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text()
      console.error('CrewAI API error:', errorText)
      throw new Error(`CrewAI API error: ${analysisResponse.statusText}`)
    }

    const crewResult = await analysisResponse.json()
    console.log('CrewAI analysis completed:', crewResult)

    // Structure the analysis result for our app
    const analysisResult = {
      summary: crewResult.output || crewResult.result || 'Analysis completed successfully',
      recommendations: crewResult.recommendations || [
        'Consult with your healthcare provider to discuss these results',
        'Follow up with recommended tests if suggested',
        'Maintain a healthy lifestyle with proper diet and exercise'
      ],
      abnormal_values: crewResult.abnormal_values || [],
      overall_assessment: crewResult.assessment || 'Please consult with a healthcare professional for proper interpretation',
      analysis_date: new Date().toISOString(),
      processed_by: 'CrewAI Blood Test Analyzer'
    }

    console.log('Structured analysis result:', analysisResult)

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

    console.log('Lab test record updated successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        message: 'Blood report analyzed successfully using CrewAI'
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
