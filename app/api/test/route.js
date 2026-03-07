export const maxDuration = 30

export async function GET() {
  const key = process.env.GEMINI_API_KEY
  if (!key) return Response.json({ fatal: 'GEMINI_API_KEY is NOT set in Vercel environment variables' })

  // Test the exact models we use in analyze route
  const candidates = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-flash-latest',
    'gemini-2.5-flash',
  ]

  const results = []
  let workingModel = null

  for (const model of candidates) {
    if (workingModel) break
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with just the word OK' }] }] }),
        signal: AbortSignal.timeout(8000),
      })
      const data = await res.json()
      const result = {
        model,
        httpStatus: res.status,
        ok: res.ok,
        error: res.ok ? null : data?.error?.message?.slice(0, 120),
        response: res.ok ? data?.candidates?.[0]?.content?.parts?.[0]?.text : null,
      }
      results.push(result)
      if (res.ok) workingModel = model
    } catch (err) {
      results.push({ model, httpStatus: 'TIMEOUT', error: err.message?.slice(0, 80) })
    }
  }

  return Response.json({
    keyPrefix: key.slice(0, 12) + '...',
    workingModel: workingModel || 'NONE — check errors below',
    pdfParseConfig: 'serverComponentsExternalPackages set in next.config.js',
    results,
  })
}
