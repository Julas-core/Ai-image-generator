import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// NOTE: You must have the Google AI Platform API enabled in your Google Cloud project.
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GOOGLE_PROJECT_ID = Deno.env.get("GOOGLE_PROJECT_ID"); // You'll need to add this secret
const API_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/imagegeneration@006:predict`;


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!GEMINI_API_KEY || !GOOGLE_PROJECT_ID) {
    return new Response(
      JSON.stringify({ error: "Missing GEMINI_API_KEY or GOOGLE_PROJECT_ID in Supabase secrets." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt in request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Imagen API error:", errorText);
      return new Response(
        JSON.stringify({ error: `Failed to generate image. ${errorText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const responseJSON = await response.json();
    const image = responseJSON.predictions[0].bytesBase64Encoded;

    return new Response(JSON.stringify({ image }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})