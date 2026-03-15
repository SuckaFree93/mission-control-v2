#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Setup Mission Control v2 Debriefing System
.DESCRIPTION
    Configures automated daily and weekly debriefing reports
    Daily: 8 AM EST (7 AM CST)
    Daily: 6 PM EST (5 PM CST)
    Weekly: Every Sunday at 10 AM EST (9 AM CST)
.PARAMETER Action
    The action to perform: install, test, remove, status
.PARAMETER Notify
    Enable notifications (telegram, email, both)
.EXAMPLE
    .\setup-debriefing.ps1 install
    .\setup-debriefing.ps1 test
    .\setup-debriefing.ps1 status
    .\setup-debriefing.ps1 remove
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("install", "test", "remove", "status")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("telegram", "email", "both", "none")]
    [string]$Notify = "telegram"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$DebriefingScript = Join-Path $ProjectRoot "scripts\debriefing.js"
$LogFile = Join-Path $ProjectRoot "debriefing.log"
$StatsFile = Join-Path $ProjectRoot "debriefing-stats.json"

function Write-Status {
    param([string]$Message, [string]$Type = "info")
    
    $colors = @{
        "success" = "Green"
        "error"   = "Red"
        "warning" = "Yellow"
        "info"    = "Cyan"
    }
    
    $symbols = @{
        "success" = "✅"
        "error"   = "❌"
        "warning" = "⚠️"
        "info"    = "ℹ️"
    }
    
    $color = $colors[$Type]
    $symbol = $symbols[$Type]
    
    Write-Host "$symbol " -NoNewline -ForegroundColor $color
    Write-Host $Message -ForegroundColor $color
}

function Test-DebriefingSystem {
    Write-Status "Testing debriefing system..." "info"
    
    try {
        # Test Node.js availability
        $nodeVersion = node --version
        Write-Status "Node.js version: $nodeVersion" "success"
        
        # Test script execution
        $testOutput = node $DebriefingScript test 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Debriefing script test passed" "success"
            
            # Show sample output
            $sample = $testOutput | Select-String -Pattern "DAILY DEBRIEFING" -Context 0,5
            if ($sample) {
                Write-Host "`nSample output:" -ForegroundColor Gray
                Write-Host $sample -ForegroundColor Gray
            }
        } else {
            Write-Status "Debriefing script test failed" "error"
            Write-Host $testOutput -ForegroundColor Red
            return $false
        }
        
        # Check log file
        if (Test-Path $LogFile) {
            $logSize = (Get-Item $LogFile).Length
            Write-Status "Log file exists ($([math]::Round($logSize/1KB,2)) KB)" "success"
        } else {
            Write-Status "Log file will be created on first run" "warning"
        }
        
        return $true
    }
    catch {
        Write-Status "Test failed: $_" "error"
        return $false
    }
}

function Install-DebriefingSystem {
    Write-Status "Installing debriefing system..." "info"
    
    # 1. Test system first
    if (-not (Test-DebriefingSystem)) {
        Write-Status "System test failed. Installation aborted." "error"
        return
    }
    
    # 2. Create scheduled tasks
    Write-Status "Creating scheduled tasks..." "info"
    
    $tasks = @(
        @{
            Name = "Mission Control Daily Morning Debriefing"
            Description = "Daily morning system report at 7 AM CST (8 AM EST)"
            Time = "07:00"
            Days = "Daily"
            Command = "node.exe"
            Arguments = "`"$DebriefingScript`" daily"
        },
        @{
            Name = "Mission Control Daily Evening Debriefing"
            Description = "Daily evening system report at 5 PM CST (6 PM EST)"
            Time = "17:00"
            Days = "Daily"
            Command = "node.exe"
            Arguments = "`"$DebriefingScript`" daily"
        },
        @{
            Name = "Mission Control Weekly Debriefing"
            Description = "Weekly system report every Sunday at 9 AM CST (10 AM EST)"
            Time = "09:00"
            Days = "Sunday"
            Command = "node.exe"
            Arguments = "`"$DebriefingScript`" weekly"
        }
    )
    
    foreach ($task in $tasks) {
        Write-Status "Creating task: $($task.Name)" "info"
        
        $taskExists = Get-ScheduledTask -TaskName $task.Name -ErrorAction SilentlyContinue
        if ($taskExists) {
            Write-Status "Task already exists, updating..." "warning"
            Unregister-ScheduledTask -TaskName $task.Name -Confirm:$false
        }
        
        $action = New-ScheduledTaskAction -Execute $task.Command -Argument $task.Arguments -WorkingDirectory $ProjectRoot
        $trigger = New-ScheduledTaskTrigger -Daily -At $task.Time -DaysOfWeek $task.Days
        $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        
        try {
            Register-ScheduledTask -TaskName $task.Name -Description $task.Description `
                -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force
            Write-Status "Task created successfully" "success"
        }
        catch {
            Write-Status "Failed to create task: $_" "error"
        }
    }
    
    # 3. Configure notifications
    Write-Status "Configuring notifications ($Notify)..." "info"
    
    $envFile = Join-Path $ProjectRoot ".env.local"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Raw
        
        switch ($Notify) {
            "telegram" {
                if (-not ($envContent -match "TELEGRAM_BOT_TOKEN")) {
                    Add-Content $envFile "`n# Debriefing Notifications`nTELEGRAM_BOT_TOKEN=your_bot_token_here`nTELEGRAM_CHAT_ID=your_chat_id_here"
                    Write-Status "Telegram variables added to .env.local" "warning"
                    Write-Host "Please update TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID" -ForegroundColor Yellow
                }
            }
            "email" {
                if (-not ($envContent -match "SMTP_SERVER")) {
                    Add-Content $envFile "`n# Email Notifications`nSMTP_SERVER=smtp.gmail.com`nSMTP_PORT=587`nFROM_EMAIL=your_email@gmail.com`nTO_EMAIL=recipient@example.com"
                    Write-Status "Email variables added to .env.local" "warning"
                    Write-Host "Please update email configuration" -ForegroundColor Yellow
                }
            }
            "both" {
                if (-not ($envContent -match "TELEGRAM_BOT_TOKEN|SMTP_SERVER")) {
                    Add-Content $envFile "`n# Debriefing Notifications`nTELEGRAM_BOT_TOKEN=your_bot_token_here`nTELEGRAM_CHAT_ID=your_chat_id_here`nSMTP_SERVER=smtp.gmail.com`nSMTP_PORT=587`nFROM_EMAIL=your_email@gmail.com`nTO_EMAIL=recipient@example.com"
                    Write-Status "Notification variables added to .env.local" "warning"
                    Write-Host "Please update notification configuration" -ForegroundColor Yellow
                }
            }
        }
    }
    
    # 4. Create backup directory
    $backupDir = Join-Path $ProjectRoot "debriefing-archive"
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Write-Status "Backup directory created: $backupDir" "success"
    }
    
    # 5. Generate initial test report
    Write-Status "Generating initial test report..." "info"
    $testReport = node $DebriefingScript daily 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Initial report generated successfully" "success"
        
        # Show first few lines
        $lines = $testReport -split "`n" | Select-Object -First 10
        Write-Host "`nFirst 10 lines of report:" -ForegroundColor Gray
        $lines | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
    }
    
    Write-Status "`n🎉 Debriefing system installation complete!" "success"
    Write-Host "`nSchedule Summary:" -ForegroundColor Cyan
    Write-Host "• Daily Morning: 7:00 AM CST (8:00 AM EST)" -ForegroundColor White
    Write-Host "• Daily Evening: 5:00 PM CST (6:00 PM EST)" -ForegroundColor White
    Write-Host "• Weekly: Sunday 9:00 AM CST (10:00 AM EST)" -ForegroundColor White
    Write-Host "`nLog file: $LogFile" -ForegroundColor Gray
    Write-Host "Test command: .\setup-debriefing.ps1 test" -ForegroundColor Gray
}

function Remove-DebriefingSystem {
    Write-Status "Removing debriefing system..." "info"
    
    $tasks = @(
        "Mission Control Daily Morning Debriefing",
        "Mission Control Daily Evening Debriefing",
        "Mission Control Weekly Debriefing"
    )
    
    foreach ($taskName in $tasks) {
        $taskExists = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
        if ($taskExists) {
            try {
                Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
                Write-Status "Removed task: $taskName" "success"
            }
            catch {
                Write-Status "Failed to remove task $taskName: $_" "error"
            }
        } else {
            Write-Status "Task not found: $taskName" "warning"
        }
    }
    
    Write-Status "Debriefing system removed" "success"
}

function Get-DebriefingStatus {
    Write-Status "Checking debriefing system status..." "info"
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Status "Node.js: $nodeVersion" "success"
    } catch {
        Write-Status "Node.js: Not found" "error"
        return
    }
    
    # Check script
    if (Test-Path $DebriefingScript) {
        Write-Status "Debriefing script: Found" "success"
    } else {
        Write-Status "Debriefing script: Not found" "error"
        return
    }
    
    # Check scheduled tasks
    $tasks = @(
        "Mission Control Daily Morning Debriefing",
        "Mission Control Daily Evening Debriefing",
        "Mission Control Weekly Debriefing"
    )
    
    Write-Host "`nScheduled Tasks:" -ForegroundColor Cyan
    foreach ($taskName in $tasks) {
        $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
        if ($task) {
            $state = $task.State
            $nextRun = $task.NextRunTime
            $status = if ($state -eq "Ready") { "✅ Ready" } else { "⚠️ $state" }
            Write-Host "  $taskName" -ForegroundColor White
            Write-Host "    Status: $status" -ForegroundColor Gray
            if ($nextRun) {
                Write-Host "    Next Run: $nextRun" -ForegroundColor Gray
            }
        } else {
            Write-Host "  $taskName: ❌ Not installed" -ForegroundColor Red
        }
    }
    
    # Check log files
    Write-Host "`nLog Files:" -ForegroundColor Cyan
    if (Test-Path $LogFile) {
        $logInfo = Get-Item $LogFile
        $sizeKB = [math]::Round($logInfo.Length / 1KB, 2)
        $modified = $logInfo.LastWriteTime
        Write-Host "  debriefing.log: $sizeKB KB, modified $modified" -ForegroundColor Gray
    } else {
        Write-Host "  debriefing.log: No logs yet" -ForegroundColor Yellow
    }
    
    if (Test-Path $StatsFile) {
        $stats = Get-Content $StatsFile | ConvertFrom-Json
        Write-Host "`nStatistics:" -ForegroundColor Cyan
        Write-Host "  Total Debriefings: $($stats.totalDebriefings)" -ForegroundColor Gray
        Write-Host "  Successful: $($stats.successful)" -ForegroundColor Gray
        Write-Host "  Failed: $($stats.failed)" -ForegroundColor Gray
        Write-Host "  Last Daily: $($stats.lastDaily)" -ForegroundColor Gray
        Write-Host "  Last Weekly: $($stats.lastWeekly)" -ForegroundColor Gray
    }
    
    # Test run
    Write-Host "`nQuick Test:" -ForegroundColor Cyan
    try {
        $testResult = node $DebriefingScript test 2>&1 | Select-String -Pattern "Testing debriefing system" -Context 0,2
        if ($testResult) {
            Write-Host "  ✅ System test passed" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Test output unexpected" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Test failed" -ForegroundColor Red
    }
}

# Main execution
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║             MISSION CONTROL v2 DEBRIEFING SYSTEM             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

switch ($Action) {
    "install" {
        Install-DebriefingSystem
    }
    "test" {
        Test-DebriefingSystem
    }
    "remove" {
        Remove-DebriefingSystem
    }
    "status" {
        Get-DebriefingStatus
    }
}

Write-Host "`nOperation completed: $Action" -ForegroundColor Cyan