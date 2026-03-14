$env:Path = 'C:\Program Files\nodejs;C:\Program Files\Git\cmd;' + $env:Path
Set-Location 'C:\Project Code Claude\shahzad-job-coach-ai'
git add app/api/analyze/route.js app/page.js
git commit -m "Redesign: vibrant gradients, 12 AI cards, Job Description heading, Thank You/Salary/90-Day Plan"
git push origin main
