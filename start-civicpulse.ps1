īparam(
    [switch]$SkipFrontendInstall
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend-angular'

if (-not (Test-Path -LiteralPath $backendPath)) {
    throw "Backend folder not found: $backendPath"
}

if (-not (Test-Path -LiteralPath $frontendPath)) {
    throw "Frontend folder not found: $frontendPath"
}

$mavenWrapperPath = Join-Path $backendPath 'mvnw.cmd'
$hasMavenWrapper = Test-Path -LiteralPath $mavenWrapperPath
$mavenCommand = if ($hasMavenWrapper) {
    $mavenWrapperPath
}
else {
    $mvnCmd = Get-Command mvn.cmd -ErrorAction SilentlyContinue
    if ($mvnCmd) {
        $mvnCmd.Source
    }
    else {
        $mvn = Get-Command mvn -ErrorAction SilentlyContinue
        if ($mvn) { $mvn.Source } else { $null }
    }
}

if (-not $mavenCommand) {
    throw 'Maven is not installed and backend/mvnw.cmd was not found.'
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue) -and -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw 'npm is not installed or not available in PATH.'
}

$javaHome = $env:JAVA_HOME
if ([string]::IsNullOrWhiteSpace($javaHome) -or -not (Test-Path -LiteralPath $javaHome)) {
    $javaCommand = Get-Command java.exe -ErrorAction SilentlyContinue
    if (-not $javaCommand) {
        $javaCommand = Get-Command java -ErrorAction SilentlyContinue
    }

    if ($javaCommand) {
        # java.exe usually lives under <JAVA_HOME>\bin
        $javaHome = Split-Path -Parent (Split-Path -Parent $javaCommand.Source)
    }
}

if ([string]::IsNullOrWhiteSpace($javaHome) -or -not (Test-Path -LiteralPath $javaHome)) {
    throw 'Java not found. Install JDK 17 and/or set JAVA_HOME before running this script.'
}

$npmCommand = (Get-Command npm.cmd -ErrorAction SilentlyContinue)
if ($npmCommand) {
    $npmCommand = $npmCommand.Source
}
else {
    $npmCommand = (Get-Command npm -ErrorAction Stop).Source
}

$frontendNodeModules = Join-Path $frontendPath 'node_modules'
if (-not $SkipFrontendInstall -and -not (Test-Path -LiteralPath $frontendNodeModules)) {
    Write-Host 'Installing frontend dependencies (frontend-angular/node_modules missing)...' -ForegroundColor Yellow
    Push-Location $frontendPath
    try {
        npm install
    }
    finally {
        Pop-Location
    }
}

Write-Host 'Starting backend in a new PowerShell window...' -ForegroundColor Cyan
Start-Process -FilePath 'cmd.exe' -WorkingDirectory $backendPath -ArgumentList @(
    '/k',
    ('set "JAVA_HOME={0}" && "{1}" spring-boot:run' -f $javaHome, $mavenCommand)
) | Out-Null

Write-Host 'Starting frontend in a new PowerShell window...' -ForegroundColor Cyan
Start-Process -FilePath 'cmd.exe' -WorkingDirectory $frontendPath -ArgumentList @(
    '/k',
    ('"{0}" run start' -f $npmCommand)
) | Out-Null

Write-Host ''
Write-Host 'Both services are launching:' -ForegroundColor Green
Write-Host 'Backend:  http://localhost:8080'
Write-Host 'Frontend: http://localhost:4200'
Write-Host ''
Write-Host 'If script execution is blocked, run this once in PowerShell:' -ForegroundColor DarkYellow
Write-Host 'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'
