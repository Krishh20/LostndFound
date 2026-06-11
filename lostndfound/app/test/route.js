export async function GET() {
  const KEY = process.env.OPEN_API_KEY;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: "Generate 5 verification questions for a lost wallet"
        }
      ]
    })
  });

  const data = await response.json();

  return Response.json(data);
}