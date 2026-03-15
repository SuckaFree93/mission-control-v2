// Recovery History API
import { NextRequest, NextResponse } from 'next/server';
import { agentMonitorDB } from '@/lib/agent-monitor/database';
import { RecoveryAttempt } from '@/lib/agent-monitor/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const days = parseInt(searchParams.get('days') || '7');

    // Get recovery attempts
    let recoveryAttempts: RecoveryAttempt[] = [];
    if (agentId) {
      recoveryAttempts = await agentMonitorDB.getRecoveryAttempts(agentId, limit);
    }

    // Get health events
    const healthEvents = await agentMonitorDB.getHealthEvents(limit);

    // Calculate recovery statistics
    const totalAttempts = recoveryAttempts.length;
    const successfulAttempts = recoveryAttempts.filter(a => a.status === 'success').length;
    const failedAttempts = recoveryAttempts.filter(a => a.status === 'failed').length;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        recoveryAttempts,
        healthEvents,
        statistics: {
          totalAttempts,
          successfulAttempts,
          failedAttempts,
          successRate: Math.round(successRate * 100) / 100,
          averageDuration: recoveryAttempts.length > 0 
            ? Math.round(recoveryAttempts.reduce((sum, a) => sum + (a.duration || 0), 0) / recoveryAttempts.length)
            : 0
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting recovery history:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get recovery history',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}