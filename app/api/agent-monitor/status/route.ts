// Agent Monitor Status API
import { NextRequest, NextResponse } from 'next/server';
import { agentMonitorService } from '@/lib/agent-monitor/monitor-service';

export async function GET(request: NextRequest) {
  try {
    const agents = agentMonitorService.getAllAgents();
    const monitoringStatus = agentMonitorService.getMonitoringStatus();
    const config = agentMonitorService.getConfig();
    const recoveryStrategies = agentMonitorService.getRecoveryStrategies();

    return NextResponse.json({
      success: true,
      data: {
        monitoring: monitoringStatus,
        agents: agents,
        config: config,
        recoveryStrategies: recoveryStrategies,
        timestamp: new Date().toISOString()
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
        agentMonitorService.startMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Monitoring started'
        });

      case 'stop_monitoring':
        agentMonitorService.stopMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Monitoring stopped'
        });

      case 'register_agent':
        if (!agentId || !params.name) {
          return NextResponse.json(
            { success: false, error: 'Missing agentId or name' },
            { status: 400 }
          );
        }
        await agentMonitorService.registerAgent(agentId, params.name, params.tags);
        return NextResponse.json({
          success: true,
          message: `Agent ${params.name} registered`
        });

      case 'update_heartbeat':
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Missing agentId' },
            { status: 400 }
          );
        }
        await agentMonitorService.updateAgentHeartbeat(agentId, params.responseTime);
        return NextResponse.json({
          success: true,
          message: 'Heartbeat updated'
        });

      case 'trigger_recovery':
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Missing agentId' },
            { status: 400 }
          );
        }
        // This would trigger manual recovery
        // For now, just log it
        console.log(`Manual recovery triggered for agent: ${agentId}`);
        return NextResponse.json({
          success: true,
          message: 'Recovery triggered (simulated)'
        });

      case 'update_config':
        agentMonitorService.updateConfig(params.config || {});
        return NextResponse.json({
          success: true,
          message: 'Configuration updated'
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