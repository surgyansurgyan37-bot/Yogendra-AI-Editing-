export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const {
      topic,
      language = "Hindi",
      duration = "1",
      style = "Cinematic"
    } = req.body || {};

    if (!topic || !String(topic).trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY Vercel में configured नहीं है."
      });
    }

    const prompt = `
Create a complete YouTube video script.

Language: ${language}
Topic: ${topic}
Duration: ${duration} minutes
Style: ${style}

Write a natural, engaging script with:
1. Strong hook
2. Introduction
3. Main content
4. Examples
5. Key takeaway
6. Ending

Return only the video narration script.
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI API error"
      });
    }

    return res.status(200).json({
      script: data.output_text || ""
    });

  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}
