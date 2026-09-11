import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const { action, resume, jobDescription } = await request.json();
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const prompt = action === "tailor"
    ? `Analyze this resume against the job description. Return JSON with score (0-100), missingKeywords (string[]), suggestions (string[]), and tailoredSummary (string). Resume: ${JSON.stringify(resume)} Job description: ${jobDescription}`
    : `Improve this resume content for ATS readability. Return JSON with improvedSummary (string), suggestions (string[]), and keywords (string[]). Resume: ${JSON.stringify(resume)}`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o-mini", response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] })
  });
  if (!response.ok) return new Response(JSON.stringify({ error: await response.text() }), { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const result = await response.json();
  return new Response(result.choices[0].message.content, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
