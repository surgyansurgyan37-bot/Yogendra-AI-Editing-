export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "text is required" });
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({model:"gpt-4o-mini-tts",voice:"alloy",input:text,response_format:"mp3"})
    });
    if(!r.ok) return res.status(r.status).send(await r.text());
    const buffer=Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type","audio/mpeg");
    return res.status(200).send(buffer);
  } catch(e) { return res.status(500).json({error:e.message}); }
}