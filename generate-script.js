module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured in Vercel Environment Variables."
    });
  }

  try {
    const body = req.body || {};
    const topic = String(body.topic || "").trim();
    const length = String(body.length || "5");
    const format = String(body.format || "16:9 YouTube");
    const style = String(body.style || "Educational Story");
    const language = String(body.language || "Hindi");

    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const prompt = [
      "Create a complete YouTube-ready video script.",
      "Topic: " + topic,
      "Length: " + length + " minutes",
      "Format: " + format,
      "Style: " + style,
      "Language: " + language,
      "Requirements:",
      "- Write in natural Hindi (Devanagari).",
      "- Make it engaging from the first 10 seconds.",
      "- Include a strong hook, introduction, main story/explanation, useful details, and a clear ending.",
      "- Create enough narration for the requested duration.",
      "- Do not mention these instructions.",
      "- Return only the final script, without JSON, markdown code fences, or commentary."
    ].join("\n");

    const model = process.env.OPENAI_MODEL || "gpt-6-luna";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: model,
        input: prompt,
        max_output_tokens: 12000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data && data.error && data.error.message
        ? data.error.message
        : "OpenAI request failed with status " + response.status;
      return res.status(response.status).json({ error: message });
    }

    let script = data && data.output_text;

    if (!script && data && Array.isArray(data.output)) {
      script = data.output
        .reduce(function (all, item) {
          const content = item && Array.isArray(item.content) ? item.content : [];
          return all.concat(content);
        }, [])
        .filter(function (item) { return item && item.type === "output_text"; })
        .map(function (item) { return item.text || ""; })
        .join("\n");
    }

    if (!script) {
      return res.status(502).json({ error: "No text was returned by OpenAI." });
    }

    return res.status(200).json({ script: script });
  } catch (error) {
    console.error("generate-script error:", error);
    return res.status(500).json({
      error: "Server error while generating the script."
    });
  }
};
