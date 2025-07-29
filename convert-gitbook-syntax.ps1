# GitBook zu Docusaurus Konvertierungs-Skript
$version2Docs = "c:\Users\JB\workspace\OpenHD\UnifiedOpenHDWebsite\docusaurus-website\versioned_docs\version-2.0"

# Alle .md Dateien im version-2.0 Ordner finden
$markdownFiles = Get-ChildItem -Path $version2Docs -Recurse -Filter "*.md"

foreach ($file in $markdownFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Datei einlesen
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # GitBook hint tags in Docusaurus Admonitions konvertieren
    $content = $content -replace '\{% hint style="warning" %\}', ':::warning'
    $content = $content -replace '\{% hint style="info" %\}', ':::info'
    $content = $content -replace '\{% hint style="danger" %\}', ':::danger'
    $content = $content -replace '\{% hint style="success" %\}', ':::tip'
    $content = $content -replace '\{% endhint %\}', ':::'
    
    # Escaped Klammern reparieren (GitBook Syntax)
    $content = $content -replace '\\(', '('
    $content = $content -replace '\\)', ')'
    
    # Datei zurückschreiben
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

Write-Host "Konvertierung abgeschlossen!"
