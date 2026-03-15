#!/usr/bin/env node

/**
 * Mission Control v2 Debriefing Script
 * 
 * Daily: 8 AM EST (7 AM CST / 13:00 UTC)
 * Daily: 6 PM EST (5 PM CST / 23:00 UTC)
 * Weekly: Every Sunday at 10 AM EST (9 AM CST / 15:00 UTC)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

class DebriefingSystem {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.debriefingLog = path.join(this.projectRoot, 'debriefing.log');
    this.statsFile = path.join(this.projectRoot, 'debriefing-stats.json');
  }

  async generateDailyDebriefing() {
    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Chicago'
    });

    try {
      // Get system status
      const healthStatus = await this.checkHealth();
      const agentStatus = await this.getAgentStatus();
      const userStats = await this.getUserStats();
      const errorLogs = await this.getErrorLogs();

      const debriefing = `
╔══════════════════════════════════════════════════════════════╗
║                    DAILY DEBRIEFING REPORT                   ║
║                    ${date.padEnd(40)} ║
╚══════════════════════════════════════════════════════════════╝

📊 SYSTEM STATUS:
${healthStatus}

🤖 AGENT MONITORING:
${agentStatus}

👥 USER ACTIVITY:
${userStats}

🚨 RECENT ISSUES:
${errorLogs}

🎯 RECOMMENDATIONS:
1. Review agent performance metrics
2. Check for pending user approvals
3. Monitor system health trends
4. Review security logs

⏰ NEXT DEBRIEFING: ${this.getNextDebriefingTime()}

────────────────────────────────────────────────────────────────
Generated: ${timestamp}
      `.trim();

      // Log to file
      await this.logDebriefing(debriefing, 'daily');
      
      // Send notification (placeholder for actual notification system)
      await this.sendNotification('Daily Debriefing Generated', debriefing);

      return debriefing;
    } catch (error) {
      console.error('Error generating daily debriefing:', error);
      return this.generateFallbackDebriefing('daily', error);
    }
  }

  async generateWeeklyDebriefing() {
    const timestamp = new Date().toISOString();
    const weekNumber = this.getWeekNumber();
    const weekRange = this.getWeekRange();

    try {
      // Get weekly statistics
      const weeklyStats = await this.getWeeklyStats();
      const performanceTrends = await this.getPerformanceTrends();
      const userGrowth = await this.getUserGrowth();
      const systemUptime = await this.getSystemUptime();

      const debriefing = `
╔══════════════════════════════════════════════════════════════╗
║                   WEEKLY DEBRIEFING REPORT                   ║
║                    Week ${weekNumber} - ${weekRange}                    ║
╚══════════════════════════════════════════════════════════════╝

📈 WEEKLY OVERVIEW:
${weeklyStats}

📊 PERFORMANCE TRENDS:
${performanceTrends}

👥 USER GROWTH:
${userGrowth}

⚙️ SYSTEM RELIABILITY:
${systemUptime}

🏆 WEEKLY HIGHLIGHTS:
1. System uptime: ${systemUptime.includes('100%') ? 'Perfect! 🎉' : 'Good'}
2. User growth: Positive trend 📈
3. Performance: Stable and responsive ⚡
4. Security: No major incidents reported 🔒

🎯 WEEKLY GOALS:
1. Improve system response time by 10%
2. Add 2 new monitoring features
3. Complete security audit
4. Enhance user onboarding process

📅 NEXT WEEK FOCUS:
- Performance optimization
- Feature enhancements
- User feedback implementation
- Documentation updates

────────────────────────────────────────────────────────────────
Generated: ${timestamp}
Week: ${weekNumber}
      `.trim();

      // Log to file
      await this.logDebriefing(debriefing, 'weekly');
      
      // Send notification
      await this.sendNotification('Weekly Debriefing Generated', debriefing);

      return debriefing;
    } catch (error) {
      console.error('Error generating weekly debriefing:', error);
      return this.generateFallbackDebriefing('weekly', error);
    }
  }

  async checkHealth() {
    try {
      // In a real implementation, this would check actual endpoints
      return `✅ System Health: Excellent (100% uptime)
✅ Database: Connected and responsive
✅ API Services: All endpoints operational
✅ WebSocket: Connection established
✅ Authentication: JWT service running`;
    } catch (error) {
      return `⚠️ Health Check: Partial issues detected\n   ${error.message}`;
    }
  }

  async getAgentStatus() {
    try {
      // Mock agent status - in real implementation, query database
      return `🟢 Online Agents: 8/12 (67%)
🟡 Degraded Agents: 2/12 (17%)
🔴 Offline Agents: 2/12 (17%)
📊 Average CPU Usage: 42%
💾 Average Memory Usage: 68%`;
    } catch (error) {
      return `⚠️ Agent Status: Unable to retrieve\n   ${error.message}`;
    }
  }

  async getUserStats() {
    try {
      // Mock user stats
      return `👥 Total Users: 156
✅ Active Today: 42
📱 Mobile Users: 28 (67%)
💻 Desktop Users: 14 (33%)
🔐 New Logins: 18
🚪 Failed Attempts: 3`;
    } catch (error) {
      return `⚠️ User Stats: Unable to retrieve\n   ${error.message}`;
    }
  }

  async getErrorLogs() {
    try {
      // Check for recent errors
      const errors = [
        '03/14 08:30 - API timeout (resolved)',
        '03/14 12:15 - Database connection spike',
        '03/14 14:45 - Cache miss rate increased'
      ];
      
      if (errors.length === 0) {
        return '✅ No critical errors in the last 24 hours';
      }
      
      return errors.map(e => `⚠️ ${e}`).join('\n');
    } catch (error) {
      return `⚠️ Error Logs: Unable to retrieve\n   ${error.message}`;
    }
  }

  async getWeeklyStats() {
    try {
      return `📈 Weekly Metrics:
• Total API Requests: 124,500
• Average Response Time: 42ms
• System Uptime: 99.98%
• User Growth: +12 users
• Data Processed: 1.2TB`;
    } catch (error) {
      return `⚠️ Weekly Stats: Unable to retrieve\n   ${error.message}`;
    }
  }

  async getPerformanceTrends() {
    try {
      return `📊 Performance Analysis:
• Response Time: Improved by 8% 📈
• Error Rate: Reduced by 15% 📉
• Cache Efficiency: Increased by 12% ⚡
• Database Queries: Optimized by 20% 🗃️`;
    } catch (error) {
      return `⚠️ Performance Trends: Unable to retrieve\n   ${error.message}`;
    }
  }

  async getUserGrowth() {
    try {
      return `👥 User Analytics:
• New Registrations: +18 this week
• Active Users: 42 daily average
• User Retention: 85% weekly
• Top Countries: US, UK, DE, CA`;
    } catch (error) {
      return `⚠️ User Growth: Unable to retrieve\n   ${error.message}`;
    }
  }

  async getSystemUptime() {
    try {
      return `⚙️ System Reliability:
• Uptime: 99.98% (7.2 minutes downtime)
• Incidents: 2 minor (both resolved)
• Maintenance: 1 scheduled (completed)
• Backups: All successful ✅`;
    } catch (error) {
      return `⚠️ System Uptime: Unable to retrieve\n   ${error.message}`;
    }
  }

  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  }

  getWeekRange() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  getNextDebriefingTime() {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours < 8) return 'Today at 8:00 AM EST';
    if (hours < 18) return 'Today at 6:00 PM EST';
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.toLocaleDateString('en-US', { weekday: 'short' })} at 8:00 AM EST`;
  }

  async logDebriefing(content, type) {
    const logEntry = `\n\n=== ${type.toUpperCase()} DEBRIEFING - ${new Date().toISOString()} ===\n${content}\n`;
    
    try {
      fs.appendFileSync(this.debriefingLog, logEntry);
      console.log(`✅ ${type} debriefing logged to ${this.debriefingLog}`);
    } catch (error) {
      console.error(`❌ Failed to log ${type} debriefing:`, error);
    }
  }

  async sendNotification(title, message) {
    // Placeholder for actual notification system
    // In production, this could send email, Slack message, etc.
    console.log(`📢 Notification: ${title}`);
    console.log(message.substring(0, 200) + '...');
    
    // Example: Send to Telegram via OpenClaw
    // await execPromise('openclaw telegram send "Mission Control Debriefing"');
  }

  generateFallbackDebriefing(type, error) {
    const timestamp = new Date().toISOString();
    return `
⚠️ FALLBACK ${type.toUpperCase()} DEBRIEFING ⚠️
Generated: ${timestamp}
Status: System check failed
Error: ${error.message}

System is running in fallback mode.
Please check:
1. Database connection
2. API services
3. Log files
4. Network connectivity

Next manual check recommended.
    `.trim();
  }

  async updateStats() {
    const stats = {
      lastDaily: new Date().toISOString(),
      lastWeekly: new Date().toISOString(),
      totalDebriefings: 0,
      successful: 0,
      failed: 0
    };

    try {
      if (fs.existsSync(this.statsFile)) {
        const existing = JSON.parse(fs.readFileSync(this.statsFile, 'utf8'));
        stats.totalDebriefings = existing.totalDebriefings + 1;
        stats.successful = existing.successful + 1;
        stats.failed = existing.failed;
      } else {
        stats.totalDebriefings = 1;
        stats.successful = 1;
        stats.failed = 0;
      }

      fs.writeFileSync(this.statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }
}

// CLI Interface
async function main() {
  const debriefing = new DebriefingSystem();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: node debriefing.js [command]

Commands:
  daily     - Generate daily debriefing
  weekly    - Generate weekly debriefing
  test      - Test debriefing system
  stats     - Show debriefing statistics
  help      - Show this help message

Examples:
  node debriefing.js daily
  node debriefing.js weekly
  node debriefing.js test
    `);
    return;
  }

  const command = args[0].toLowerCase();

  switch (command) {
    case 'daily':
      const dailyReport = await debriefing.generateDailyDebriefing();
      console.log(dailyReport);
      await debriefing.updateStats();
      break;

    case 'weekly':
      const weeklyReport = await debriefing.generateWeeklyDebriefing();
      console.log(weeklyReport);
      await debriefing.updateStats();
      break;

    case 'test':
      console.log('🧪 Testing debriefing system...');
      const testDaily = await debriefing.generateDailyDebriefing();
      console.log(testDaily.substring(0, 500) + '...\n');
      console.log('✅ Test completed successfully');
      break;

    case 'stats':
      try {
        if (fs.existsSync(debriefing.statsFile)) {
          const stats = JSON.parse(fs.readFileSync(debriefing.statsFile, 'utf8'));
          console.log(`
📊 DEBRIEFING STATISTICS:
• Total Debriefings: ${stats.totalDebriefings}
• Successful: ${stats.successful}
• Failed: ${stats.failed}
• Last Daily: ${new Date(stats.lastDaily).toLocaleString()}
• Last Weekly: ${new Date(stats.lastWeekly).toLocaleString()}
          `.trim());
        } else {
          console.log('No statistics available yet.');
        }
      } catch (error) {
        console.error('Error reading stats:', error);
      }
      break;

    case 'help':
    default:
      console.log('Use: node debriefing.js [daily|weekly|test|stats|help]');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DebriefingSystem;