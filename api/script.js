export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { story } = req.body || {};
    if (!story) return res.status(400).json({ error: "story is required" });
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body: JSON.stringify({model:"gpt-4.1-mini", input:`Convert this story into a YouTube video scene plan. Return valid JSON only with an array named scenes. Each scene must have title, narration, and image_prompt. Story:\n${story}`})
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json({result:data.output_text || data});
  } catch(e) { return res.status(500).json({error:e.message}); }
}