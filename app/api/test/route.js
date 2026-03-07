export const maxDuration = 30

export async function GET() {
  const key = process.env.GEMINI_API_KEY
  if (!key) return Response.json({ fatal: 'GEMINI_API_KEY is NOT set in Vercel environment variables' })

  // Step 1: List all models available for this API key
  let availableModels = []
  let listError = null
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    )
    const listData = await listRes.json()
    if (listRes.ok) {
      availableModels = (listData.models || [])
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace('models/', ''))
    } else {
      listError = listData?.error?.message
    }
  } catch (e) {
    listError = e.message
  }

  // Step 2: Try top candidates on both v1 and v1beta
  const candidates = [
    { model: 'gemini-1.5-flash', api: 'v1beta' },
    { model: 'gemini-1.5-flash', api: 'v1' },
    { model: 'gemini-1.5-flash-latest', api: 'v1beta' },
    { model: 'gemini-2.0-flash-exp', api: 'v1beta' },
    { model: 'gemini-pro', api: 'v1beta' },
  ]

  const testResults = []
  let workingModel = null

  for (const { model, api } of candidates) {
    if (workingModel) break
    try {
      const url = `https://generativelanguage.googleapis.com/${api}/models/${model}:generateContent?key=${key}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with just the word OK' }] }] }),
        signal: AbortSignal.timeout(8000),
      })
      const data = await res.json()
      const result = {
        model,
        api,
        httpStatus: res.status,
        ok: res.ok,
        error: res.ok ? null : data?.error?.message,
        response: res.ok ? data?.candidates?.[0]?.content?.parts?.[0]?.text : null,
      }
      testResults.push(result)
      if (res.ok) workingModel = `${api}/${model}`
    } catch (err) {
      testResults.push({ model, api, httpStatus: 'TIMEOUT/NETWORK', error: err.message })
    }
  }

  return Response.json({
    keyPrefix: key.slice(0, 12) + '...',
    workingModel: workingModel || 'NONE — all failed',
    availableModels: availableModels.length ? availableModels : `Error listing: ${listError}`,
    testResults,
  }, { status: 200 })
}
