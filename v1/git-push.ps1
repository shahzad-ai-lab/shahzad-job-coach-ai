$env:Path = 'C:\Program Files\nodejs;C:\Program Files\Git\cmd;' + $env:Path
Set-Location 'C:\Project Code Claude\shahzad-job-coach-ai'
git init
git add .
git commit -m "Initial commit: Job Coach AI - 6 AI cards powered by Gemini"
git branch -M main
git remote add origin https://github.com/shahzad-ai-lab/shahzad-job-coach-ai.git
git push -u origin main
