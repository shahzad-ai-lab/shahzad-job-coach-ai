$env:Path = 'C:\Program Files\nodejs;' + $env:Path
Set-Location 'C:\Project Code Claude\shahzad-job-coach-ai'
npm install -g vercel
vercel --prod --yes --token (Read-Host "Paste your Vercel token")
