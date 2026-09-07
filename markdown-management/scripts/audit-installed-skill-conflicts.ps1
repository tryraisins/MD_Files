[CmdletBinding()]
param(
    [Parameter()]
    [string[]]$Roots,

    [Parameter()]
    [string]$ReportPath
)

$ErrorActionPreference = "Stop"
if (-not $Roots -or $Roots.Count -eq 0) {
    $userRoot = [Environment]::GetFolderPath("UserProfile")
    $Roots = @(
        (Join-Path $userRoot ".codex\skills"),
        (Join-Path $userRoot ".agents\skills"),
        (Join-Path $userRoot ".claude\skills")
    )
}

$skills = [System.Collections.Generic.List[object]]::new()
foreach ($root in $Roots) {
    if (-not (Test-Path -LiteralPath $root -PathType Container)) {
        continue
    }

    $resolvedRoot = (Resolve-Path -LiteralPath $root).Path
    foreach ($skillFile in Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Filter "SKILL.md") {
        $content = Get-Content -Raw -LiteralPath $skillFile.FullName
        if ($content -notmatch '(?s)\A---\r?\n(?<yaml>.*?)\r?\n---(?:\r?\n|\z)') {
            continue
        }

        $frontmatter = $Matches.yaml
        if ($frontmatter -notmatch '(?m)^name:\s*["'']?(?<value>[^\r\n"'']+)["'']?\s*$') {
            continue
        }

        $folder = Split-Path -Leaf $skillFile.DirectoryName
        $skills.Add([pscustomobject]@{
            Name = $Matches.value.Trim()
            Folder = $folder
            Path = $skillFile.DirectoryName
            Root = $resolvedRoot
            Hash = (Get-FileHash -LiteralPath $skillFile.FullName -Algorithm SHA256).Hash
            Managed = $folder.StartsWith("yeknal-", [StringComparison]::OrdinalIgnoreCase)
        })
    }
}

$duplicates = @($skills | Group-Object Name | Where-Object Count -gt 1 | Sort-Object Name)
$conflicts = @($duplicates | Where-Object {
    $distinctHashes = @($_.Group.Hash | Sort-Object -Unique).Count
    $distinctKinds = @($_.Group.Managed | Sort-Object -Unique).Count
    $distinctHashes -gt 1 -or $distinctKinds -gt 1
})
$identicalMirrors = $duplicates.Count - $conflicts.Count
$report = [System.Collections.Generic.List[string]]::new()
$report.Add("# Installed Skill Conflict Audit")
$report.Add("")
$report.Add("- Roots found: $(@($Roots | Where-Object { Test-Path -LiteralPath $_ -PathType Container }).Count)")
$report.Add("- Skill entry points: $($skills.Count)")
$report.Add("- Duplicate names across roots: $($duplicates.Count)")
$report.Add("- Priority conflicts: $($conflicts.Count)")
$report.Add("- Identical mirrors suppressed: $identicalMirrors")
$report.Add("")
$report.Add("This report is read-only. Priority conflicts have divergent content or mix managed and unprefixed copies. Review ownership and content before archiving anything; a managed ``yeknal-*`` copy is not proof that another copy is obsolete.")
$report.Add("")

if ($conflicts.Count -eq 0) {
    $report.Add("No priority conflicts found.")
}
else {
    foreach ($conflict in $conflicts) {
        $report.Add("## $($conflict.Name)")
        $report.Add("")
        foreach ($skill in $conflict.Group | Sort-Object @{ Expression = "Managed"; Descending = $true }, Path) {
            $kind = if ($skill.Managed) { "managed" } else { "unprefixed" }
            $shortHash = $skill.Hash.Substring(0, 12).ToLowerInvariant()
            $report.Add("- ``$($skill.Path)`` ($kind, sha256 ``$shortHash``)")
        }
        $report.Add("")
    }
}

$text = $report -join [Environment]::NewLine
if ($ReportPath) {
    $resolvedReport = if ([IO.Path]::IsPathRooted($ReportPath)) { $ReportPath } else { Join-Path (Get-Location) $ReportPath }
    [IO.File]::WriteAllText($resolvedReport, $text + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
    Write-Output "Wrote $resolvedReport"
}
else {
    Write-Output $text
}
