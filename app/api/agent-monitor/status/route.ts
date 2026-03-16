// Agent Monitor Status API - Simplified for Vercel
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory data for Vercel deployment
const sampleAgents = [
  { 
    id: 'gateway-001', 
    name: 'OpenClaw Gateway', 
    status: 'healthy',
    lastHeartbeat: new Date().toISOString(),
    responseTime: 150,
    errorCount: 0,
    uptime: 86400,
    cpuUsage: 12.5,
    memoryUsage: 520.87,
    autoRecoveryEnabled: true,
    recoveryAttempts: 2,
    maxRecoveryAttempts: 3,
    lastRecoveryAttempt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const monitoringStatus = {
  isMonitoring: true,
  lastCheck: new Date().toISOString(),
  totalAgents: 1,
  healthyAgents: 1,
  degradedAgents: 0,
  offlineAgents: 0
};

const config = {
  healthCheckInterval: 30000,
  recoveryTimeout: 60000,
  maxRecoveryAttempts: 3,
  enableAutoRecovery: true,
  notificationChannels: ['telegram']
};

const recoveryStrategies = [
  { id: 'restart', name: 'Restart Process', description: 'Restart the agent process', priority: 1 },
  { id: 'port-check', name: 'Port Check', description: 'Check if port is listening', priority: 2 },
  { id: 'resource-cleanup', name: 'Resource Cleanup', description: 'Clean up system resources', priority: 3 }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        monitoring: monitoringStatus,
        agents: sampleAgents,
        config: config,
        recoveryStrategies: recoveryStrategies,
        timestamp: new Date().toISOString(),
        note: 'Using simplified memory data for Vercel deployment'
      }
    });
  } catch (error) {
    console.error('Error getting agent monitor status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get agent monitor status',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agentId, ...params } = body;

    switch (action) {
      case 'start_monitoring':
        return NextResponse.json({
          success: true,
          message: 'Monitoring started (simulated)'
        });

      case 'stop_monitoring':
        return NextResponse.json({
          success: true,
          message: 'Monitoring stopped (simulated)'
        });

      case 'register_agent':
        if (!agentId || !params.name) {
          return NextResponse.json(
            { success: false, error: 'Missing agentId or name' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          message: `Agent ${params.name} registered (simulated)`
        });

      case 'update_heartbeat':
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Missing agentId' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          message: 'Heartbeat updated (simulated)'
        });

      case 'trigger_recovery':
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Missing agentId' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          message: 'Recovery triggered (simulated)'
        });

      case 'update_config':
        return NextResponse.json({
          success: true,
          message: 'Configuration updated (simulated)'
        });

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing agent monitor action:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process action',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}