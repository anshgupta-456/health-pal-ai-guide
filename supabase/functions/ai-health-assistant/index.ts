
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) throw new Error("Messages array required");

    // Gemini expects messages as [{role, parts:[{text}]}]
    const geminiMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...messages.map((msg: { role: string, content: string }) => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    ];

    // Gemini model API endpoint (production - v1beta)
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: geminiMessages })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      throw new Error(`Gemini API call failed: ${errText}`);
    }

    const data = await geminiRes.json();
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a reply from Gemini.";

    return new Response(
      JSON.stringify({ reply: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error("Edge function error:", e.message || e);
    return new Response(
      JSON.stringify({ error: e.message ?? "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
