# PowerShell Script to migrate GitHub wiki-content links to local assets
Write-Host "🚀 Starting GitHub Wiki-Content to Local Assets Migration..." -ForegroundColor Green

# Define paths
$docsPath = "versioned_docs/version-2.0"
$assetsPath = "static/img/assets"
$v20AssetsPath = "static/img/assets/v2-0"

# Ensure v2-0 assets directory exists
if (-not (Test-Path $v20AssetsPath)) {
    New-Item -ItemType Directory -Path $v20AssetsPath -Force
    Write-Host "📁 Created directory: $v20AssetsPath" -ForegroundColor Yellow
}

# Get all markdown files
$markdownFiles = Get-ChildItem -Path $docsPath -Recurse -Filter "*.md"
Write-Host "📄 Found $($markdownFiles.Count) markdown files to process" -ForegroundColor Cyan

$totalReplacements = 0
$missingAssets = @()

foreach ($file in $markdownFiles) {
    Write-Host "🔍 Processing: $($file.Name)" -ForegroundColor White
    
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    $fileReplacements = 0
    
    # Pattern 1: OpenHD/Open.HD links
    $pattern1 = 'https://github\.com/OpenHD/Open\.HD/raw/master/wiki-content/([^)]+\.(jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG))'
    $matches1 = [regex]::Matches($content, $pattern1)
    
    foreach ($match in $matches1) {
        $fullUrl = $match.Value
        $imagePath = $match.Groups[1].Value
        $fileName = Split-Path $imagePath -Leaf
        $fileName = [System.Uri]::UnescapeDataString($fileName)
        
        Write-Host "  🖼️  Found: $fileName" -ForegroundColor Gray
        
        # Check if asset exists locally
        $localAssetFound = $false
        $targetPath = ""
        
        if (Test-Path "$assetsPath/$fileName") {
            $localAssetFound = $true
            $targetPath = "/img/assets/$fileName"
        } elseif (Test-Path "$v20AssetsPath/$fileName") {
            $localAssetFound = $true
            $targetPath = "/img/assets/v2-0/$fileName"
        }
        
        if ($localAssetFound) {
            $content = $content -replace [regex]::Escape($fullUrl), $targetPath
            $fileReplacements++
            Write-Host "    ✅ Replaced with: $targetPath" -ForegroundColor Green
        } else {
            Write-Host "    ❌ Asset not found locally: $fileName" -ForegroundColor Red
            $missingAssets += "$($file.Name): $fileName"
        }
    }
    
    # Pattern 2: HD-Fpv/Open.HD links
    $pattern2 = 'https://github\.com/HD-Fpv/Open\.HD/raw/master/wiki-content/([^)]+\.(jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG))'
    $matches2 = [regex]::Matches($content, $pattern2)
    
    foreach ($match in $matches2) {
        $fullUrl = $match.Value
        $imagePath = $match.Groups[1].Value
        $fileName = Split-Path $imagePath -Leaf
        $fileName = [System.Uri]::UnescapeDataString($fileName)
        
        Write-Host "  🖼️  Found: $fileName" -ForegroundColor Gray
        
        # Check if asset exists locally
        $localAssetFound = $false
        $targetPath = ""
        
        if (Test-Path "$assetsPath/$fileName") {
            $localAssetFound = $true
            $targetPath = "/img/assets/$fileName"
        } elseif (Test-Path "$v20AssetsPath/$fileName") {
            $localAssetFound = $true
            $targetPath = "/img/assets/v2-0/$fileName"
        }
        
        if ($localAssetFound) {
            $content = $content -replace [regex]::Escape($fullUrl), $targetPath
            $fileReplacements++
            Write-Host "    ✅ Replaced with: $targetPath" -ForegroundColor Green
        } else {
            Write-Host "    ❌ Asset not found locally: $fileName" -ForegroundColor Red
            $missingAssets += "$($file.Name): $fileName"
        }
    }
    
    # Save the file if changes were made
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  💾 Saved $fileReplacements replacements in $($file.Name)" -ForegroundColor Green
        $totalReplacements += $fileReplacements
    }
}

# Summary
Write-Host "`n🎉 Migration Complete!" -ForegroundColor Green
Write-Host "📊 Total replacements: $totalReplacements" -ForegroundColor Cyan

if ($missingAssets.Count -gt 0) {
    Write-Host "`n⚠️  Missing Assets:" -ForegroundColor Yellow
    foreach ($asset in $missingAssets) {
        Write-Host "  ❌ $asset" -ForegroundColor Red
    }
}

Write-Host "`n✨ All GitHub wiki-content links have been processed!" -ForegroundColor Green
