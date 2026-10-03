[CmdletBinding()]
param(
    [Parameter()]
    [string]$Root = ".",

    [Parameter()]
    [string]$ReportPath
)

$ErrorActionPreference = "Stop"
$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$failures = [System.Collections.Generic.List[object]]::new()
$checkedLinks = 0
$ignoredDirectories = @(".git", "node_modules", ".next", "dist", "build", ".venv", "venv")

$markdownFiles = Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Filter "*.md" |
    Where-Object {
        $relative = [IO.Path]::GetRelativePath($resolvedRoot, $_.FullName)
        -not ($ignoredDirectories | Where-Object { $relative -match "(^|[\\/])$([regex]::Escape($_))([\\/]|$)" })
    }

foreach ($file in $markdownFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    $links = [regex]::Matches($content, '(?m)!?\[[^\]]*\]\((?<target>[^)]+)\)')

    foreach ($link in $links) {
        $target = $link.Groups['target'].Value.Trim().Trim('<', '>')
        $target = ($target -split '\s+["'']', 2)[0]
        if (-not $target -or $target.StartsWith('#') -or $target -match '^[a-z][a-z0-9+.-]*:') {
            continue
        }

        $pathPart = ($target -split '#', 2)[0]
        if (-not $pathPart) {
            continue
        }

        $checkedLinks++
        $decoded = [Uri]::UnescapeDataString($pathPart)
        $candidate = Join-Path $file.DirectoryName $decoded
        if (-not (Test-Path -LiteralPath $candidate)) {
            $failures.Add([pscustomobject]@{
                File = [IO.Path]::GetRelativePath($resolvedRoot, $file.FullName)
                Target = $target
            })
        }
    }
}

$report = [System.Collections.Generic.List[string]]::new()
$report.Add("# Markdown Link Audit")
$report.Add("")
$report.Add("- Root: ``$resolvedRoot``")
$report.Add("- Markdown files: $(@($markdownFiles).Count)")
$report.Add("- Relative links checked: $checkedLinks")
$report.Add("- Unresolved targets: $($failures.Count)")
$report.Add("")

if ($failures.Count -eq 0) {
    $report.Add("No unresolved relative Markdown links found.")
}
else {
    $report.Add("| File | Target |")
    $report.Add("| --- | --- |")
    foreach ($failure in $failures) {
        $safeFile = $failure.File.Replace('|', '\|')
        $safeTarget = $failure.Target.Replace('|', '\|')
        $report.Add("| ``$safeFile`` | ``$safeTarget`` |")
    }
}

$text = $report -join [Environment]::NewLine
if ($ReportPath) {
    $resolvedReport = if ([IO.Path]::IsPathRooted($ReportPath)) { $ReportPath } else { Join-Path $resolvedRoot $ReportPath }
    [IO.File]::WriteAllText($resolvedReport, $text + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
    Write-Output "Wrote $resolvedReport"
}
else {
    Write-Output $text
}

if ($failures.Count -gt 0) {
    exit 1
}
