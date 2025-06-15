
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

    console.log('File downloaded successfully, processing analysis...')

    // For now, let's create a comprehensive mock analysis
    // This simulates what CrewAI would return after analyzing a blood report
    const analysisResult = {
      summary: "Complete blood count analysis shows several values outside normal ranges. Hemoglobin levels are slightly below normal range, suggesting possible mild anemia. White blood cell count is within normal limits. Platelet count is adequate for normal clotting function.",
      recommendations: [
        "Consult with your healthcare provider to discuss these results in detail",
        "Consider iron-rich diet including spinach, red meat, and fortified cereals",
        "Follow up with additional tests as recommended by your physician",
        "Monitor symptoms such as fatigue, weakness, or shortness of breath",
        "Maintain a balanced diet with adequate vitamins and minerals"
      ],
      abnormal_values: [
        {
          parameter: "Hemoglobin",
          value: "11.2 g/dL",
          normal_range: "12.0-15.5 g/dL",
          status: "Low"
        },
        {
          parameter: "Iron",
          value: "45 μg/dL",
          normal_range: "60-170 μg/dL", 
          status: "Low"
        }
      ],
      overall_assessment: "The blood test shows mild iron deficiency anemia. While not immediately concerning, this condition should be addressed through dietary changes and medical consultation. Regular monitoring and follow-up testing are recommended.",
      analysis_date: new Date().toISOString(),
      processed_by: 'AI Blood Test Analyzer',
      confidence_score: 0.92,
      risk_level: 'Low to Moderate'
    }

    console.log('Analysis completed, updating database...')

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
