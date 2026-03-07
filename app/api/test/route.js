export async function GET() {
  const key = process.env.GEMINI_API_KEY
  if (!key) return Response.json({ error: 'GEMINI_API_KEY not set in environment' })

  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro']
  const results = []

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Say OK' }] }] }),
        signal: AbortSignal.timeout(8000),
      })
      const data = await res.json()
      if (res.ok) {
        results.push({ model, status: 'OK', response: data?.candidates?.[0]?.content?.parts?.[0]?.text })
        break // found working model, stop
      } else {
        results.push({ model, status: res.status, error: data?.error?.message })
      }
    } catch (err) {
      results.push({ model, status: 'ERROR', error: err.message })
    }
  }

  return Response.json({ keyPrefix: key.slice(0, 10) + '...', results })
}
