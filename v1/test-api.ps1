$body = '{"resumeText":"John Smith Software Engineer 5 years React NodeJS Python TechCorp BSc Computer Science","jobPosting":"Senior Frontend Developer React TypeScript 3 years experience build UI components"}'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$request = [System.Net.WebRequest]::Create('https://shahzad-job-coach-ai.vercel.app/api/analyze')
$request.Method = 'POST'
$request.ContentType = 'application/json'
$request.ContentLength = $bytes.Length
$request.Timeout = 60000
$stream = $request.GetRequestStream()
$stream.Write($bytes, 0, $bytes.Length)
$stream.Close()
try {
  $response = $request.GetResponse()
  $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
  $content = $reader.ReadToEnd()
  Write-Output "HTTP 200 OK"
  Write-Output $content.Substring(0, [Math]::Min(500, $content.Length))
} catch [System.Net.WebException] {
  $errResponse = $_.Exception.Response
  $reader = New-Object System.IO.StreamReader($errResponse.GetResponseStream())
  $errBody = $reader.ReadToEnd()
  Write-Output "HTTP $([int]$errResponse.StatusCode)"
  Write-Output $errBody
}
