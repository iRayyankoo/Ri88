$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8082/")
$listener.Start()
Write-Host "Server started at http://localhost:8082/"
Write-Host "Press Enter to stop..."
try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
        }
        catch { break }
    
        $request = $context.Request
        $response = $context.Response
    
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        $localPath = Join-Path $PSScriptRoot $path
    
        if (Test-Path $localPath) {
            try {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css" { "text/css; charset=utf-8" }
                    ".js" { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".png" { "image/png" }
                    ".jpg" { "image/jpeg" }
                    ".svg" { "image/svg+xml" }
                    default { "application/octet-stream" }
                }
                $response.ContentType = $mime
        
                $content = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            }
            catch {
                $response.StatusCode = 500
            }
        }
        else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
}
finally { $listener.Stop() }
