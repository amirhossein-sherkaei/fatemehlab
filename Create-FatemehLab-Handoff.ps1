#requires -Version 5.1
<##
FatemehLab project handoff packager
- Creates a sanitized ZIP containing source, configuration, documentation, migrations, tests and public visual assets.
- Excludes dependencies, build output, Git internals, secrets, environment files, databases/backups, logs and font binaries.
- Does not modify the project.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Section([string]$Message) {
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Get-RelativePathCompat([string]$BasePath, [string]$FullPath) {
    $base = [System.IO.Path]::GetFullPath($BasePath).TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
    $full = [System.IO.Path]::GetFullPath($FullPath)
    if ($full.StartsWith($base, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $full.Substring($base.Length)
    }
    return $full
}

function Test-IsAllowedFile([System.IO.FileInfo]$File) {
    $name = $File.Name
    $ext = $File.Extension.ToLowerInvariant()

    # Never package environment files, local credentials, certificates, private keys or font binaries.
    if ($name -match '^(?i)\.env($|\.)') { return $false }
    if ($name -match '^(?i)(\.npmrc|\.pypirc|\.netrc|\.git-credentials)$') { return $false }
    if ($ext -in @('.pem','.key','.p12','.pfx','.jks','.keystore','.cer','.crt','.mobileprovision','.der')) { return $false }
    if ($ext -in @('.woff','.woff2','.ttf','.otf','.eot')) { return $false }

    # Exclude databases, local state, logs, archives, compiled artifacts and source maps.
    if ($ext -in @('.db','.sqlite','.sqlite3','.log','.bak','.backup','.dump','.gz','.zip','.7z','.rar','.tar','.tgz','.map','.min.map','.wasm')) { return $false }
    if ($ext -in @('.mp4','.mov','.avi','.mkv','.webm','.mp3','.wav','.flac')) { return $false }
    if ($name -match '(?i)(^|[._-])(service[-_]?account|credentials?|secrets?|private[-_]?key|id_rsa|id_ed25519)([._-]|$)') { return $false }
    if ($name -match '^(?i)(thumbs\.db|desktop\.ini|\.ds_store)$') { return $false }

    # Source, configuration, documentation, database migrations and useful visual assets.
    $allowedExtensions = @(
        '.ts','.tsx','.js','.jsx','.mjs','.cjs','.mts','.cts',
        '.css','.scss','.sass','.less',
        '.html','.htm','.md','.mdx','.txt','.rst',
        '.json','.jsonc','.yaml','.yml','.toml','.xml',
        '.sql','.prisma','.graphql','.gql',
        '.sh','.ps1','.bat','.cmd',
        '.svg','.png','.jpg','.jpeg','.webp','.avif','.gif','.bmp','.ico',
        '.snap','.conf','.config','.example'
    )

    $allowedNames = @(
        'Dockerfile','Makefile','Procfile','.gitignore','.gitattributes','.nvmrc',
        '.prettierignore','.prettierrc','.eslintrc','.eslintignore',
        'LICENSE','LICENSE.md','README','README.md','CHANGELOG.md'
    )

    if ($allowedExtensions -contains $ext) { return $true }
    if ($allowedNames -contains $name) { return $true }
    if ($name -match '^(next|postcss|tailwind|vite|vitest|playwright|jest|eslint|prettier|tsconfig|vercel|drizzle|wrangler|components|middleware|instrumentation|next-env)\..+$') { return $true }
    if ($name -match '^(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|bun\.lock|composer\.json)$') { return $true }

    return $false
}

function Test-ContainsLikelySecret([string]$Path) {
    # Only scans text-like files. If a recognizable live credential is found, the whole file is excluded.
    $patterns = @(
        '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----',
        '\bsk_live_[A-Za-z0-9]{12,}',
        '\bsk_test_[A-Za-z0-9]{12,}',
        '\bghp_[A-Za-z0-9]{20,}',
        '\bgithub_pat_[A-Za-z0-9_]{20,}',
        '\bxox[baprs]-[A-Za-z0-9-]{15,}',
        '\bAKIA[0-9A-Z]{16}\b',
        'postgres(?:ql)?://[^\s:/]+:[^\s@]+@',
        'mongodb(?:\+srv)?://[^\s:/]+:[^\s@]+@'
    )

    try {
        # Avoid reading large files into memory during secret scanning.
        if ((Get-Item -LiteralPath $Path).Length -gt 5MB) { return $false }
        $content = [System.IO.File]::ReadAllText($Path)
        foreach ($pattern in $patterns) {
            if ([regex]::IsMatch($content, $pattern)) { return $true }
        }
    }
    catch {
        return $false
    }
    return $false
}

function Add-EnvironmentVariableNames([string]$ProjectRoot, [string]$OutputFile, [string[]]$CopiedTextFiles) {
    $names = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

    # Read keys only from template filenames. Never copy or print values from any .env file.
    $templateFiles = @('.env.example','.env.sample','.env.template')
    foreach ($templateName in $templateFiles) {
        $candidate = Join-Path $ProjectRoot $templateName
        if (Test-Path -LiteralPath $candidate -PathType Leaf) {
            foreach ($line in [System.IO.File]::ReadAllLines($candidate)) {
                if ($line -match '^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=') {
                    [void]$names.Add($Matches[1])
                }
            }
        }
    }

    # Also discover environment variable names referenced in source code.
    foreach ($path in $CopiedTextFiles) {
        try {
            if ((Get-Item -LiteralPath $path).Length -gt 2MB) { continue }
            $text = [System.IO.File]::ReadAllText($path)
            $regexes = @(
                'process\.env\.([A-Z][A-Z0-9_]*)',
                'process\.env\[[''\"]([A-Z][A-Z0-9_]*)[''\"]\]',
                'import\.meta\.env\.([A-Z][A-Z0-9_]*)',
                'Deno\.env\.get\([''\"]([A-Z][A-Z0-9_]*)[''\"]\)'
            )
            foreach ($rx in $regexes) {
                foreach ($m in [regex]::Matches($text, $rx)) {
                    if ($m.Groups[1].Success) { [void]$names.Add($m.Groups[1].Value) }
                }
            }
        }
        catch { }
    }

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add('# Environment variable names detected')
    $lines.Add('')
    $lines.Add('Values are intentionally omitted. Never send real secrets in a project handoff.')
    $lines.Add('Add missing variables through the hosting provider dashboard, not source control.')
    $lines.Add('')
    foreach ($name in ($names | Sort-Object)) { $lines.Add("$name=<VALUE OMITTED>") }
    if ($names.Count -eq 0) { $lines.Add('No environment variable references were automatically detected.') }
    [System.IO.File]::WriteAllLines($OutputFile, $lines, [System.Text.UTF8Encoding]::new($false))
}

Write-Section 'Select the FatemehLab project folder'
Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = 'Choose the root folder of the FatemehLab project (the folder containing package.json).'
$dialog.ShowNewFolderButton = $false
if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
    Write-Host 'Cancelled. No files were changed.' -ForegroundColor Yellow
    exit 0
}

$projectRoot = [System.IO.Path]::GetFullPath($dialog.SelectedPath).TrimEnd('\')
if (-not (Test-Path -LiteralPath $projectRoot -PathType Container)) { throw 'Selected project folder does not exist.' }

$packagePath = Join-Path $projectRoot 'package.json'
if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf)) {
    $answer = Read-Host 'package.json was not found in this folder. Continue anyway? (y/N)'
    if ($answer -notmatch '^(?i)y(es)?$') { exit 0 }
}

$desktop = [Environment]::GetFolderPath('Desktop')
if ([string]::IsNullOrWhiteSpace($desktop) -or -not (Test-Path -LiteralPath $desktop)) {
    $desktop = $env:USERPROFILE
}
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$staging = Join-Path $env:TEMP "FATEMEHLAB-HANDOFF-$stamp"
$zipPath = Join-Path $desktop "FATEMEHLAB-SOURCE-HANDOFF-$stamp.zip"
New-Item -ItemType Directory -Path $staging -Force | Out-Null

$skipDirectories = @(
    'node_modules','.next','.git','.vercel','.turbo','.cache','coverage','dist','build','out',
    'tmp','temp','logs','.idea','.pytest_cache','.mypy_cache','.venv','venv','env',
    'playwright-report','test-results','storybook-static','.output','.nuxt','.svelte-kit',
    'vendor','bower_components'
)
$maxFileBytes = 40MB
$copied = New-Object System.Collections.Generic.List[object]
$skipped = New-Object System.Collections.Generic.List[object]
$copiedTextFiles = New-Object System.Collections.Generic.List[string]
$pending = New-Object 'System.Collections.Generic.Stack[string]'
$pending.Push($projectRoot)

Write-Section 'Collecting source, configuration, tests, migrations and public assets'
while ($pending.Count -gt 0) {
    $current = $pending.Pop()

    foreach ($directory in [System.IO.Directory]::EnumerateDirectories($current)) {
        $dirInfo = New-Object System.IO.DirectoryInfo($directory)
        if ($skipDirectories -contains $dirInfo.Name) { continue }
        if (($dirInfo.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
        $pending.Push($directory)
    }

    foreach ($filePath in [System.IO.Directory]::EnumerateFiles($current)) {
        $file = Get-Item -LiteralPath $filePath
        $relative = Get-RelativePathCompat $projectRoot $file.FullName

        if (-not (Test-IsAllowedFile $file)) {
            $skipped.Add([pscustomobject]@{ Path=$relative; Reason='excluded by file type/name safety rules' })
            continue
        }
        if ($file.Length -gt $maxFileBytes) {
            $skipped.Add([pscustomobject]@{ Path=$relative; Reason="larger than $([math]::Round($maxFileBytes/1MB)) MB" })
            continue
        }
        if (Test-ContainsLikelySecret $file.FullName) {
            $skipped.Add([pscustomobject]@{ Path=$relative; Reason='likely credential detected; file excluded entirely' })
            continue
        }

        $destination = Join-Path $staging $relative
        $destinationDirectory = Split-Path -Parent $destination
        if (-not (Test-Path -LiteralPath $destinationDirectory)) {
            New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
        }
        Copy-Item -LiteralPath $file.FullName -Destination $destination -Force
        $copied.Add([pscustomobject]@{ Path=$relative; Bytes=$file.Length })

        if ($file.Extension.ToLowerInvariant() -in @('.ts','.tsx','.js','.jsx','.mjs','.cjs','.mts','.cts','.json','.jsonc','.yaml','.yml','.toml','.md','.mdx','.sql','.prisma','.graphql','.gql','.css','.scss','.html')) {
            $copiedTextFiles.Add($file.FullName)
        }
    }
}

# Derive environment variable names without copying any .env file or value.
Add-EnvironmentVariableNames -ProjectRoot $projectRoot -OutputFile (Join-Path $staging 'ENVIRONMENT-VARIABLE-NAMES.txt') -CopiedTextFiles $copiedTextFiles.ToArray()

# Add a structured file manifest and a readable project tree.
$manifestPath = Join-Path $staging 'HANDOFF-FILE-MANIFEST.csv'
$copied | Sort-Object Path | Export-Csv -LiteralPath $manifestPath -NoTypeInformation -Encoding UTF8

$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add('FATEMEHLAB PROJECT HANDOFF')
$treeLines.Add("Source folder: $projectRoot")
$treeLines.Add("Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$treeLines.Add('')
$treeLines.Add('COPIED FILES')
$treeLines.Add('============')
foreach ($item in ($copied | Sort-Object Path)) { $treeLines.Add($item.Path) }
$treeLines.Add('')
$treeLines.Add('SKIPPED FILES')
$treeLines.Add('=============')
foreach ($item in ($skipped | Sort-Object Path)) { $treeLines.Add("$($item.Path) -- $($item.Reason)") }
$treeLines.Add('')
$treeLines.Add('SAFETY NOTES')
$treeLines.Add('============')
$treeLines.Add('No .env files, database files, backups, Git internals, dependencies, build output or font binaries were packaged.')
$treeLines.Add('A filename/content scan can miss secrets hardcoded in source files. Review before sharing.')
$treeLines.Add('Real product images in public/assets folders are included when their file types and sizes are allowed.')
$treeLines.Add('Database schema and migration source files are included; live customer/order database contents are not.')
[System.IO.File]::WriteAllLines((Join-Path $staging 'HANDOFF-REPORT.txt'), $treeLines, [System.Text.UTF8Encoding]::new($false))

# Add concise package metadata, if package.json exists.
if (Test-Path -LiteralPath $packagePath) {
    try {
        $pkg = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
        $pkgLines = @(
            '# Project package summary',
            "Name: $($pkg.name)",
            "Version: $($pkg.version)",
            "Package manager: $($pkg.packageManager)",
            "Scripts:"
        )
        if ($pkg.scripts) {
            foreach ($prop in $pkg.scripts.PSObject.Properties) { $pkgLines += "- $($prop.Name): $($prop.Value)" }
        }
        [System.IO.File]::WriteAllLines((Join-Path $staging 'PACKAGE-SUMMARY.txt'), $pkgLines, [System.Text.UTF8Encoding]::new($false))
    }
    catch {
        [System.IO.File]::WriteAllText((Join-Path $staging 'PACKAGE-SUMMARY.txt'), 'package.json exists but could not be parsed.', [System.Text.UTF8Encoding]::new($false))
    }
}

Write-Section 'Creating ZIP archive'
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zipPath -CompressionLevel Optimal
$zipSize = (Get-Item -LiteralPath $zipPath).Length

# Keep a small report on the Desktop as well as inside the ZIP.
$desktopReport = Join-Path $desktop "FATEMEHLAB-HANDOFF-REPORT-$stamp.txt"
Copy-Item -LiteralPath (Join-Path $staging 'HANDOFF-REPORT.txt') -Destination $desktopReport -Force
Remove-Item -LiteralPath $staging -Recurse -Force

Write-Section 'Finished'
Write-Host "Included files: $($copied.Count)" -ForegroundColor Green
Write-Host "Skipped files:  $($skipped.Count)" -ForegroundColor Yellow
Write-Host ("ZIP size:       {0:N2} MB" -f ($zipSize / 1MB)) -ForegroundColor Green
Write-Host "ZIP:            $zipPath" -ForegroundColor Green
Write-Host "Report:         $desktopReport" -ForegroundColor Green
Write-Host ''
Write-Host 'Before uploading, open the ZIP and quickly check that it contains no private customer data or secrets.' -ForegroundColor Yellow
Write-Host 'Upload the ZIP here. Do not send .env files, passwords, API keys or payment credentials.' -ForegroundColor Cyan
