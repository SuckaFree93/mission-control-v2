import { NextRequest, NextResponse } from 'next/server';
import { getWebSocketServer } from '@/lib/websocket/simple-server';

// Agent monitoring API endpoint
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agentId = searchParams.get('agentId');
  
  try {
    const wss = getWebSocketServer();
    
    // Simulate agent data
    const agents = [
      { id: 'agent-1', name: 'Main Orchestrator', status: 'online', cpu: 45, memory: 68, uptime: '5d 12h' },
      { id: 'agent-2', name: 'Data Processor', status: 'online', cpu: 32, memory: 45, uptime: '3d 8h' },
      { id: 'agent-3', name: 'API Gateway', status: 'degraded', cpu: 78, memory: 82, uptime: '1d 4h' },
      { id: 'agent-4', name: 'Cache Manager', status: 'online', cpu: 22, memory: 34, uptime: '7d 2h' },
    ];
    
    // Filter by agentId if provided
    const filteredAgents = agentId 
      ? agents.filter(agent => agent.id === agentId)
      : agents;
    
    // Broadcast agent status via WebSocket
    filteredAgents.forEach(agent => {
      wss.broadcastAgentStatus(agent.id, agent.status);
    });
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      agents: filteredAgents,
      total: filteredAgents.length,
      online: filteredAgents.filter(a => a.status === 'online').length,
      degraded: filteredAgents.filter(a => a.status === 'degraded').length,
      offline: filteredAgents.filter(a => a.status === 'offline').length
    });
    
  } catch (error) {
    console.error('Agent monitor error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent data', details: String(error) },
      { status: 500 }
    );
  }
}

// POST endpoint for agent actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agentId, parameters } = body;
    
    const wss = getWebSocketServer();
    
    // Handle different actions
    switch (action) {
      case 'restart':
        wss.broadcastAgentStatus(agentId, 'restarting');
        // Simulate restart delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        wss.broadcastAgentStatus(agentId, 'online');
        break;
        
      case 'stop':
        wss.broadcastAgentStatus(agentId, 'stopping');
        await new Promise(resolve => setTimeout(resolve, 500));
        wss.broadcastAgentStatus(agentId, 'offline');
        break;
        
      case 'start':
        wss.broadcastAgentStatus(agentId, 'starting');
        await new Promise(resolve => setTimeout(resolve, 800));
        wss.broadcastAgentStatus(agentId, 'online');
        break;
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      status: 'success',
      message: `Agent ${agentId} ${action} completed`,
      timestamp: new Date().toISOString(),
      agentId,
      action
    });
    
  } catch (error) {
    console.error('Agent action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform agent action', details: String(error) },
      { status: 500 }
    );
  }
}