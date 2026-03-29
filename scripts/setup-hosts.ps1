# Script to add local.monkeys.com.co to hosts file
# Requires admin privileges

$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entry = "127.0.0.1 local.monkeys.com.co"

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]'Administrator')

if (-not $isAdmin) {
    Write-Host "This script requires admin privileges. Requesting elevation..."
    Start-Process powershell -ArgumentList "-File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Check if entry already exists
$content = Get-Content $hostsPath
if ($content -match [regex]::Escape($entry)) {
    Write-Host "Entry already exists in hosts file"
    exit
}

# Add the entry
Add-Content -Path $hostsPath -Value "`n$entry"
Write-Host "Successfully added '$entry' to hosts file"
