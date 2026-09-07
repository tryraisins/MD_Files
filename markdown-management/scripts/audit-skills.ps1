[CmdletBinding()]
param(
    [Parameter()]
    [string]$Root = ".",

    [Parameter()]
    [string]$ReportPath
)

$ErrorActionPreference = "Stop"
$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$issues = [System.Collections.Generic.List[object]]::new()
$skills = [System.Collections.Generic.List[object]]::new()

function Add-Issue {
    param(
        [string]$Skill,
        [ValidateSet("error", "warning", "info")]
        [string]$Severity,
        [string]$Code,
        [string]$Message
    )

    $issues.Add([pscustomobject]@{
        Skill = $Skill
        Severity = $Severity
        Code = $Code
        Message = $Message
    })
}

foreach ($directory in Get-ChildItem -LiteralPath $resolvedRoot -Directory | Sort-Object Name) {
    $skillPath = Join-Path $directory.FullName "SKILL.md"
    if (-not (Test-Path -LiteralPath $skillPath -PathType Leaf)) {
        continue
    }

    $content = Get-Content -Raw -LiteralPath $skillPath
    $lines = @(Get-Content -LiteralPath $skillPath)
    $frontmatter = $null
    if ($content -match '(?s)\A---\r?\n(?<yaml>.*?)\r?\n---(?:\r?\n|\z)') {
        $frontmatter = $Matches.yaml
    }
    else {
        Add-Issue $directory.Name error "frontmatter" "SKILL.md must start with a closed YAML frontmatter block."
    }

    $name = $null
    $description = $null
    if ($frontmatter) {
        $allowedFrontmatterFields = @("name", "description", "license", "compatibility", "metadata", "allowed-tools")
        $topLevelFields = [regex]::Matches($frontmatter, '(?m)^(?<key>[A-Za-z0-9_-]+):')
        foreach ($field in $topLevelFields) {
            $key = $field.Groups['key'].Value
            if ($key -notin $allowedFrontmatterFields) {
                Add-Issue $directory.Name error "frontmatter-field" "Unexpected top-level frontmatter field '$key'."
            }
        }

        if ($frontmatter -match '(?m)^name:\s*["'']?(?<value>[^\r\n"'']+)["'']?\s*$') {
            $name = $Matches.value.Trim()
        }
        else {
            Add-Issue $directory.Name error "name-missing" "Frontmatter requires a name."
        }

        if ($frontmatter -match '(?m)^description:\s*["'']?(?<value>[^\r\n]+?)["'']?\s*$') {
            $description = $Matches.value.Trim().Trim('"').Trim("'")
            $descriptionLine = [regex]::Match($frontmatter, '(?m)^description:\s*(?<value>[^\r\n]+)$').Groups['value'].Value.Trim()
            if ($descriptionLine -notmatch '^["'']' -and $descriptionLine -match ':\s') {
                Add-Issue $directory.Name error "description-yaml" "An unquoted description cannot safely contain a colon followed by whitespace. Quote or rewrite it."
            }
        }
        else {
            Add-Issue $directory.Name error "description-missing" "Frontmatter requires a description."
        }
    }

    if ($name) {
        if ($name -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$' -or $name.Length -gt 64) {
            Add-Issue $directory.Name error "name-format" "Name must be 1-64 lowercase letters, numbers, or single hyphens."
        }
        if ($name -cne $directory.Name) {
            Add-Issue $directory.Name error "name-folder-mismatch" "Frontmatter name '$name' must exactly match folder '$($directory.Name)'."
        }
    }

    if ($description) {
        if ($description.Length -gt 1024) {
            Add-Issue $directory.Name error "description-length" "Description is $($description.Length) characters; maximum is 1024."
        }
        if ($description -notmatch '(?i)\b(use|when|trigger|whenever|for)\b') {
            Add-Issue $directory.Name warning "description-trigger" "Description may not explain when the skill should trigger."
        }
    }

    if ($lines.Count -gt 500) {
        Add-Issue $directory.Name warning "progressive-disclosure" "SKILL.md has $($lines.Count) lines; move detail to references when practical."
    }

    $relativeLinks = [regex]::Matches($content, '(?m)!?\[[^\]]*\]\((?<target>[^)]+)\)')
    foreach ($link in $relativeLinks) {
        $target = $link.Groups['target'].Value.Trim().Trim('<', '>')
        $target = ($target -split '\s+["'']', 2)[0]
        if (-not $target -or $target.StartsWith('#') -or $target -match '^[a-z][a-z0-9+.-]*:') {
            continue
        }

        $pathPart = ($target -split '#', 2)[0]
        if (-not $pathPart) {
            continue
        }

        $decoded = [Uri]::UnescapeDataString($pathPart)
        $candidate = Join-Path $directory.FullName $decoded
        if (-not (Test-Path -LiteralPath $candidate)) {
            Add-Issue $directory.Name error "broken-relative-link" "Relative link does not resolve: $target"
        }
    }

    $skills.Add([pscustomobject]@{
        Folder = $directory.Name
        Name = $name
        Description = $description
        Lines = $lines.Count
        Resources = @(Get-ChildItem -LiteralPath $directory.FullName -Recurse -File | Where-Object FullName -ne $skillPath).Count
    })
}

$duplicateNames = $skills | Where-Object Name | Group-Object Name | Where-Object Count -gt 1
foreach ($group in $duplicateNames) {
    foreach ($skill in $group.Group) {
        Add-Issue $skill.Folder error "duplicate-name" "Name '$($group.Name)' is also used by: $((($group.Group.Folder | Where-Object { $_ -ne $skill.Folder }) -join ', '))."
    }
}

$errors = @($issues | Where-Object Severity -eq "error").Count
$warnings = @($issues | Where-Object Severity -eq "warning").Count
$report = [System.Collections.Generic.List[string]]::new()
$report.Add("# Skill Audit")
$report.Add("")
$report.Add("- Root: ``$resolvedRoot``")
$report.Add("- Skills: $($skills.Count)")
$report.Add("- Errors: $errors")
$report.Add("- Warnings: $warnings")
$report.Add("")
$report.Add("## Issues")
$report.Add("")

if ($issues.Count -eq 0) {
    $report.Add("No issues found.")
}
else {
    $report.Add("| Severity | Skill | Code | Detail |")
    $report.Add("| --- | --- | --- | --- |")
    foreach ($issue in $issues | Sort-Object @{Expression={ switch ($_.Severity) { 'error' { 0 } 'warning' { 1 } default { 2 } } }}, Skill, Code) {
        $safeMessage = $issue.Message.Replace('|', '\|').Replace("`r", ' ').Replace("`n", ' ')
        $report.Add("| $($issue.Severity) | ``$($issue.Skill)`` | ``$($issue.Code)`` | $safeMessage |")
    }
}

$report.Add("")
$report.Add("## Inventory")
$report.Add("")
$report.Add("| Skill | Lines | Resources | Description |")
$report.Add("| --- | ---: | ---: | --- |")
foreach ($skill in $skills) {
    $safeDescription = if ($skill.Description) { $skill.Description.Replace('|', '\|') } else { '' }
    $report.Add("| ``$($skill.Folder)`` | $($skill.Lines) | $($skill.Resources) | $safeDescription |")
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

if ($errors -gt 0) {
    exit 1
}
