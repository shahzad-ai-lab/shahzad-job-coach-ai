async function testAPI() {
  console.log('Sending request to live API...')
  const payload = {
    resumeText: "Experienced Software Engineer with 5 years in React and Node.js.",
    jobPosting: "Looking for a Frontend Developer with React.",
    deepDiveGoal: "Find a job fast",
    requestedKeys: ["resumeScore"]
  }

  try {
    const res = await fetch('https://shahzad-job-coach-ai.vercel.app/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    console.log("Response Status:", res.status)
    const text = await res.text()
    console.log("Raw Response Body:")
    console.log(text)
  } catch (err) {
    console.error("Fetch Error:", err)
  }
}

testAPI()
