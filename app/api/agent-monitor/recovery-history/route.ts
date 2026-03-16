// Recovery History API - Memory-based version for Vercel
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory data for Vercel deployment
const sampleRecoveryAttempts = [
  {
    id: 'recovery-1',
    agentId: 'gateway-001',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'success',
    action: 'restart',
    duration: 5000,
    error: null,
    details: { port: 18789, pid: 14080 }
  },
  {
    id: 'recovery-2',
    agentId: 'gateway-001',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'failed',
    action: 'restart',
    duration: 30000,
    error: 'Process timeout',
    details: { port: 18789, pid: null }
  }
];

const sampleHealthEvents = [
  {
    id: 'health-1',
    agentId: 'gateway-001',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    metrics: { cpu: 12.5, memory: 520.87, uptime: 86400 },
    message: 'Gateway running normally'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get recovery attempts
    let recoveryAttempts = sampleRecoveryAttempts;
    if (agentId) {
      recoveryAttempts = sampleRecoveryAttempts.filter(a => a.agentId === agentId);
    }

    // Get health events
    const healthEvents = sampleHealthEvents.slice(0, limit);

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
        timestamp: new Date().toISOString(),
        note: 'Using memory database for Vercel deployment'
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