[CmdletBinding()]
param(
    [Parameter()]
    [string]$Root = ".",

    [Parameter()]
    [string]$Dataset = "evaluations/skill-routing.json"
)

$ErrorActionPreference = "Stop"
$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$datasetPath = if ([IO.Path]::IsPathRooted($Dataset)) { $Dataset } else { Join-Path $resolvedRoot $Dataset }
$document = Get-Content -Raw -LiteralPath $datasetPath | ConvertFrom-Json

if ($document.schemaVersion -ne "1.0.0") {
    throw "Unsupported routing evaluation schema version: $($document.schemaVersion)"
}

$skillNames = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
foreach ($directory in Get-ChildItem -LiteralPath $resolvedRoot -Directory) {
    $skillPath = Join-Path $directory.FullName "SKILL.md"
    if (-not (Test-Path -LiteralPath $skillPath -PathType Leaf)) {
        continue
    }

    $content = Get-Content -Raw -LiteralPath $skillPath
    if ($content -match '(?m)^name:\s*["'']?(?<value>[^\r\n"'']+)["'']?\s*$') {
        [void]$skillNames.Add($Matches.value.Trim())
    }
}

$ids = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
$errors = [System.Collections.Generic.List[string]]::new()
$cases = @($document.cases)

foreach ($case in $cases) {
    if (-not $case.id -or -not $ids.Add([string]$case.id)) {
        $errors.Add("Evaluation IDs must be present and unique: '$($case.id)'.")
    }
    if (-not $case.prompt -or -not ([string]$case.prompt).Trim()) {
        $errors.Add("$($case.id): prompt is required.")
    }
    if (-not $case.primary -or -not $skillNames.Contains([string]$case.primary)) {
        $errors.Add("$($case.id): primary skill '$($case.primary)' does not exist.")
    }

    foreach ($name in @($case.secondary) + @($case.mustNotLead)) {
        if (-not $skillNames.Contains([string]$name)) {
            $errors.Add("$($case.id): referenced skill '$name' does not exist.")
        }
    }
    if (@($case.mustNotLead) -contains $case.primary) {
        $errors.Add("$($case.id): primary skill also appears in mustNotLead.")
    }
    if (-not $case.rationale -or -not ([string]$case.rationale).Trim()) {
        $errors.Add("$($case.id): rationale is required.")
    }
}

Write-Output "Routing evaluation cases: $($cases.Count)"
Write-Output "Available skills: $($skillNames.Count)"
Write-Output "Validation errors: $($errors.Count)"
$errors

if ($errors.Count -gt 0) {
    exit 1
}
