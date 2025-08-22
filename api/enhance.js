import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, jobTitle } = req.body;

  if (!text || !jobTitle) {
    return res.status(400).json({ error: "Missing text or jobTitle" });
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Enhance this resume for a ${jobTitle}: "${text}"`,
        max_tokens: 250
      }),
    });

    const data = await response.json();
    const enhancedText = data.choices[0].text.trim();

    res.status(200).json({ enhancedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to enhance text" });
  }
}
