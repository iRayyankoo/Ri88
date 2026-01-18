$files = Get-ChildItem -Recurse -Include *.html, *.css | Where-Object { $_.FullName -match 'assets|tools' }

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    if ($content -match '<<<<<<<') {
        # Regex to select the content between HEAD and =======, or just remove markers if simpler
        # Strategy: We essentially want to keep the content that looks "newest" or "correct". 
        # In this specific messy state, simpler is often better: Remove the marker lines themselves.
        # But looking at previous diffs, it seems we have:
        # <<<<<<< HEAD
        # ... content ...
        # =======
        # ... old content ...
        # >>>>>>> ...
        
        # We generally want HEAD.
        
        # Pattern: Match <<<<<<< HEAD ... ======= ... >>>>>>> ...
        # We will attempt to keep the TOP part (HEAD).
        $content = $content -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> [a-f0-9]+', '$1'
        
        # Fallback for simpler markers or if regex fails to match block perfectly: just clean lines
        $content = $content -replace '<<<<<<< HEAD', ''
        $content = $content -replace '=======\s*', ''
        $content = $content -replace '>>>>>>> [a-f0-9]+', ''
        
        Set-Content -Path $f.FullName -Value $content -Encoding UTF8
        Write-Host "Cleaned: $($f.Name)"
    }
}
