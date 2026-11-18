<#
.SYNOPSIS
    Builds a preloaded offline release APK for Personal Hub with your latest data.
.DESCRIPTION
    Embeds the specified SQLite snapshot into assets/preloaded_data/personal_hub_preloaded.sqlite
    and builds a signed release APK ready to share.
#>

param(
    [string]$SnapshotPath = "personal_hub_snapshot.sqlite"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$AssetsDir = Join-Path $RootDir "assets\preloaded_data"
$TargetDb = Join-Path $AssetsDir "personal_hub_preloaded.sqlite"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Personal Hub - Preloaded Offline APK Generator (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

if (-not (Test-Path $SnapshotPath)) {
    Write-Host "[INFO] Snapshot file not found at: $SnapshotPath" -ForegroundColor Yellow
    Write-Host "Usage: .\scripts\build_with_latest_data.ps1 -SnapshotPath <path_to_snapshot.sqlite>"
    exit 1
}

Write-Host "`n[1/4] Found snapshot: $SnapshotPath" -ForegroundColor Green
if (-not (Test-Path $AssetsDir)) {
    New-Item -ItemType Directory -Path $AssetsDir -Force | Out-Null
}

Copy-Item -Path $SnapshotPath -Destination $TargetDb -Force
Write-Host "[2/4] Copied snapshot to APK assets: $TargetDb" -ForegroundColor Green

Write-Host "[3/4] Building release APK with Flutter..." -ForegroundColor Cyan
Set-Location $RootDir
flutter build apk --release --no-tree-shake-icons

$BuiltApk = Join-Path $RootDir "build\app\outputs\flutter-apk\app-release.apk"
$FinalApk = Join-Path $RootDir "personal_hub_with_latest_data.apk"

if (Test-Path $BuiltApk) {
    Copy-Item -Path $BuiltApk -Destination $FinalApk -Force
    $SizeMb = [math]::Round((Get-Item $FinalApk).Length / 1MB, 2)
    Write-Host "`n[4/4] SUCCESS! Preloaded APK created:" -ForegroundColor Green
    Write-Host "      Path: $FinalApk" -ForegroundColor Green
    Write-Host "      Size: $SizeMb MB" -ForegroundColor Green
    Write-Host "`nReady to share! Any phone installing this APK will start with all your records preserved." -ForegroundColor Cyan
} else {
    Write-Host "[ERROR] Output APK not found." -ForegroundColor Red
}

