
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Gemini API key from Supabase secret
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are HealthMate, a helpful, friendly, and knowledgeable health assistant. 
You answer health questions, offer suggestions, warn when a doctor's visit is needed, and can help book appointments if relevant. 
You are not a doctor; always remind users to consult healthcare professionals for serious concerns.
If the user shares symptoms, kindly summarize their likely issue and suggest care or next steps.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) throw new Error("Messages array required");

    // Gemini's API requires a single prompt string; combine all messages
    let prompt = '';
    if (messages && Array.isArray(messages)) {
      prompt =
        `System: ${SYSTEM_PROMPT}\n` +
        messages.map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') +
        '\nAssistant:';
    } else {
      prompt = `${SYSTEM_PROMPT}\nUser: ${messages?.[messages.length - 1]?.content ?? ''}\nAssistant:`;
    }

    // Gemini model API endpoint (production - v1beta)
    const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey;
    const res = await fetch(
  "https://nknhollhzgdxmdytcwny.functions.supabase.co/ai-health-assistant",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-supabase-anon-key-here",  // <-- Required
    },
    body: JSON.stringify({ messages }),
  }
);



    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API call failed: ${errText}`);
    }

    const data = await res.json();
    // Gemini reply:
    // { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a reply from Gemini.";

    return new Response(
      JSON.stringify({ reply: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
