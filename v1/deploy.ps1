$env:Path = 'C:\Program Files\nodejs;C:\Program Files\Git\cmd;' + $env:Path
Set-Location 'C:\Project Code Claude\shahzad-job-coach-ai'
git add app/api/analyze/route.js
git commit -m "Fix: switch to gemini-1.5-flash, improve error logging"
git push origin main
