# Mission Control v2 Debriefing System

## 📋 Overview

Automated daily and weekly debriefing reports for Mission Control v2 monitoring system. The system generates comprehensive reports on system health, agent performance, user activity, and provides recommendations.

## 🕐 Schedule

### **Daily Debriefings**
- **Morning**: 8:00 AM EST (7:00 AM CST / 13:00 UTC)
- **Evening**: 6:00 PM EST (5:00 PM CST / 23:00 UTC)

### **Weekly Debriefing**
- **Every Sunday**: 10:00 AM EST (9:00 AM CST / 15:00 UTC)

## 🚀 Quick Start

### 1. Install the Debriefing System
```powershell
# Run from mission-control-v2 directory
.\scripts\setup-debriefing.ps1 install
```

### 2. Test the System
```powershell
.\scripts\setup-debriefing.ps1 test
```

### 3. Check Status
```powershell
.\scripts\setup-debriefing.ps1 status
```

### 4. Manual Test Run
```bash
node scripts/debriefing.js daily
node scripts/debriefing.js weekly
```

## 📊 What's Included in Reports

### **Daily Reports Include**:
- ✅ System health status
- 🤖 Agent monitoring statistics
- 👥 User activity metrics
- 🚨 Recent issues and errors
- 🎯 Actionable recommendations
- ⏰ Next debriefing time

### **Weekly Reports Include**:
- 📈 Weekly performance overview
- 📊 Performance trends analysis
- 👥 User growth statistics
- ⚙️ System reliability metrics
- 🏆 Weekly highlights
- 🎯 Goals for next week

## 🛠️ System Architecture

```
mission-control-v2/
├── scripts/
│   ├── debriefing.js          # Main debriefing script
│   ├── setup-debriefing.ps1   # Installation script
│   └── debriefing-cron.json   # Schedule configuration
├── debriefing.log             # Generated reports
├── debriefing-stats.json      # Execution statistics
└── debriefing-archive/        # Archived reports (30-day retention)
```

## ⚙️ Configuration

### **Environment Variables** (optional)
Add to `.env.local` for notifications:

```env
# Telegram Notifications
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Email Notifications
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
FROM_EMAIL=your_email@gmail.com
TO_EMAIL=recipient@example.com
```

### **Customizing Schedule**
Edit `scripts/debriefing-cron.json` to modify:
- Report times
- Timezone settings
- Notification preferences
- Retention policies

## 🔧 Manual Operations

### **Generate Report Manually**
```bash
# Daily report
node scripts/debriefing.js daily

# Weekly report
node scripts/debriefing.js weekly

# Test mode (no notifications)
node scripts/debriefing.js test
```

### **View Statistics**
```bash
node scripts/debriefing.js stats
```

### **View Logs**
```bash
# View latest reports
tail -f debriefing.log

# View specific report
grep -A 50 "DAILY DEBRIEFING" debriefing.log | tail -50
```

## 🖥️ Platform Support

### **Windows**
- Uses Windows Task Scheduler
- Runs with SYSTEM account
- Automatic restart on failure

### **Linux/Mac**
- Uses cron jobs
- Requires manual cron setup
- See `debriefing-cron.json` for cron syntax

### **Docker**
- Container-ready configuration
- Health check endpoints
- Log volume mounting

## 📈 Monitoring & Alerts

### **Success Monitoring**
- Reports logged to `debriefing.log`
- Statistics tracked in `debriefing-stats.json`
- Archive maintained for 30 days

### **Failure Alerts**
- Script exit codes monitored
- Failed executions logged
- Optional notification on failure

### **Health Checks**
```bash
# Test system health
node scripts/debriefing.js test

# Check API connectivity
curl http://localhost:3000/api/health
```

## 🔄 Maintenance

### **Backup & Retention**
- Reports archived for 30 days
- Automatic compression
- Manual backup script available

### **Updates**
```powershell
# Reinstall/update system
.\scripts\setup-debriefing.ps1 remove
.\scripts\setup-debriefing.ps1 install
```

### **Troubleshooting**
```powershell
# Check system status
.\scripts\setup-debriefing.ps1 status

# View error logs
Get-Content debriefing-error.log -Tail 50

# Test with debug mode
$env:NODE_ENV="debug"; node scripts/debriefing.js daily
```

## 🚨 Troubleshooting Common Issues

### **Issue: Scheduled task not running**
```powershell
# Check task status
Get-ScheduledTask -TaskName "Mission Control*"

# Run task manually
Start-ScheduledTask -TaskName "Mission Control Daily Morning Debriefing"
```

### **Issue: Node.js not found**
```powershell
# Use full path to node
$nodePath = where.exe node
# Update scheduled task with full path
```

### **Issue: Permission errors**
```powershell
# Run PowerShell as Administrator
Start-Process PowerShell -Verb RunAs

# Check file permissions
Get-Acl scripts/debriefing.js | Format-List
```

### **Issue: Database connection failed**
```bash
# Check database service
netstat -ano | findstr :3000

# Test database connection
node -e "require('./lib/auth/database.ts').testConnection()"
```

## 📱 Notifications Setup

### **Telegram Notifications**
1. Create bot with @BotFather
2. Get bot token and chat ID
3. Add to `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

### **Email Notifications**
1. Configure SMTP server
2. Add credentials to `.env.local`
3. Test with manual run

### **Custom Notifications**
Modify `debriefing.js` `sendNotification()` function to add:
- Slack webhooks
- Discord webhooks
- SMS notifications
- Custom API calls

## 🔐 Security Considerations

### **Credentials Security**
- Never commit `.env.local` to git
- Use environment variables in production
- Rotate tokens regularly

### **Access Control**
- Reports contain system information
- Restrict log file access
- Use secure notification channels

### **Audit Trail**
- All reports timestamped
- Execution logs maintained
- Change tracking available

## 📚 API Reference

### **Debriefing Class Methods**
```javascript
const Debriefing = require('./scripts/debriefing.js');

// Generate daily report
const report = await debriefing.generateDailyDebriefing();

// Generate weekly report
const weekly = await debriefing.generateWeeklyDebriefing();

// Update statistics
await debriefing.updateStats();
```

### **Custom Integration**
```javascript
// Custom report generation
const customReport = {
  generate: async (type, customData) => {
    // Add custom metrics
    const base = await debriefing[`generate${type}Debriefing`]();
    return `${base}\n\nCustom Metrics:\n${JSON.stringify(customData, null, 2)}`;
  }
};
```

## 🎯 Advanced Configuration

### **Custom Report Templates**
Edit `debriefing.js` to modify:
- Report structure
- Metrics collected
- Formatting style
- Recommendation logic

### **Additional Data Sources**
```javascript
// Add custom data collection
async function getCustomMetrics() {
  return {
    customMetric1: await fetchCustomData(),
    customMetric2: await calculateTrends(),
    // ... more metrics
  };
}
```

### **Multi-language Support**
```javascript
// Internationalization ready
const translations = {
  en: { title: "Daily Debriefing" },
  es: { title: "Informe Diario" },
  // ... more languages
};
```

## 🤝 Contributing

### **Adding New Metrics**
1. Add data collection function
2. Update report template
3. Test with manual run
4. Update documentation

### **Bug Reports**
1. Check `debriefing-error.log`
2. Test with debug mode
3. Submit issue with logs

### **Feature Requests**
1. Describe use case
2. Provide example output
3. Consider backward compatibility

## 📞 Support

### **Immediate Issues**
```powershell
# Emergency stop
.\scripts\setup-debriefing.ps1 remove

# Manual report generation
node scripts/debriefing.js daily > manual-report.txt
```

### **Documentation**
- This file: `DEBRIEFING_SYSTEM.md`
- Configuration: `scripts/debriefing-cron.json`
- Script source: `scripts/debriefing.js`

### **Community**
- GitHub Issues for bugs
- Discord for discussions
- Wiki for tutorials

## 🏁 Getting Help

### **Quick Diagnostics**
```powershell
# Run full diagnostic
.\scripts\setup-debriefing.ps1 status
node scripts/debriefing.js test
Get-Content debriefing.log -Tail 100
```

### **Common Solutions**
- **Task not running**: Check Task Scheduler, run as admin
- **Script errors**: Check Node.js version, dependencies
- **No output**: Check file permissions, disk space
- **Notifications failing**: Verify credentials, network

### **Escalation**
If issues persist:
1. Check Windows Event Viewer
2. Review system logs
3. Contact system administrator
4. Open GitHub issue

---

**Last Updated**: March 14, 2026  
**Version**: 1.0.0  
**Compatibility**: Mission Control v2.1.0+  
**Maintainer**: Ghost 👻 (AI Agent)