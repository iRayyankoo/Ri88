$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8085/")
$listener.Start()
Write-Host "Server started at http://localhost:8085/"
Write-Host "Press Enter to stop..."
try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
        }
        catch { break }
    
        $request = $context.Request
        $response = $context.Response
        
        # Add CORS Headers (Global)
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }
    
        $path = $request.Url.LocalPath

        # --- PROXY ENDPOINT (v2.01) ---
        if ($context.Request.Url.AbsolutePath -eq "/api/proxy") {
            try {
                $query = $context.Request.Url.Query.TrimStart("?")
                
                # Simple Parsing
                $targetUrl = ""
                $token = ""

                # Example: url=https://...&token=...
                # We need to manually decode because PowerShell's HttpListener doesn't AutoParse fully in all envs easily without .NET ref
                # Simpler regex approach or splitting
                
                $proxyParamParts = $query.Split("&")
                foreach ($part in $proxyParamParts) {
                    if ($part.StartsWith("url=")) {
                        $targetUrl = [System.Uri]::UnescapeDataString($part.Substring(4))
                    }
                    if ($part.StartsWith("token=")) {
                        $token = [System.Uri]::UnescapeDataString($part.Substring(6))
                    }
                }

                if (-not $targetUrl) { throw "Missing 'url' parameter" }
                
                Write-Host "Proxy Request to: $targetUrl"

                # Request to Football API
                $wc = New-Object System.Net.WebClient
                if ($token) { $wc.Headers.Add("X-Auth-Token", $token) }
                $wc.Encoding = [System.Text.Encoding]::UTF8
                $data = $wc.DownloadString($targetUrl)

                # Response
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($data)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.StatusCode = 200
            }
            catch {
                Write-Host "Proxy Error: $($_.Exception.Message)"
                $err = [System.Text.Encoding]::UTF8.GetBytes("Error: " + $_.Exception.Message)
                $response.StatusCode = 500
                $response.OutputStream.Write($err, 0, $err.Length)
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
                Write-Host "Error serving file '$localPath': $($_.Exception.Message)"
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
