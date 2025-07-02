Start-Transcript -Path "$env:USERPROFILE\Documents\git_sync_log.txt" -Append

cd "C:\Users\Haruto\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\utility-addons"  # 上記パスに書き換え
Write-Output "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Git Pull Start"

try {
    git pull --force
    Write-Output "Git pull completed successfully.`n"
} catch {
    Write-Output "Git pull failed: $_`n"
}

Stop-Transcript