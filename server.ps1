$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8083/")
$listener.Start()
Write-Host "Server started at http://localhost:8083/"
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

        # --- PROXY ENDPOINT (v2.01) ---
        if ($path -eq "/api/proxy") {
            try {
                $query = $request.Url.Query # ?url=...&token=...
                # Parse Query Manually (simple string parsing)
                $query = $query.TrimStart("?")
                $params = @{}
                $query.Split("&") | ForEach-Object {
                    $parts = $_.Split("=")
                    if ($parts.Length -eq 2) {
                        $params[[System.Uri]::UnescapeDataString($parts[0])] = [System.Uri]::UnescapeDataString($parts[1])
                    }
                }

                $targetUrl = $params["url"]
                $token = $params["token"]

                if (-not $targetUrl) { throw "Missing 'url' parameter" }

                # Make Request to Upstream
                $headers = @{}
                if ($token) { $headers["X-Auth-Token"] = $token }

                $apiResponse = Invoke-WebRequest -Uri $targetUrl -Headers $headers -UseBasicParsing

                # Forward Response
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($apiResponse.Content)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.StatusCode = 200
            }
            catch {
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("Proxy Error: $($_.Exception.Message)")
                $response.StatusCode = 500
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
            continue
        }
        # ------------------------------

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
