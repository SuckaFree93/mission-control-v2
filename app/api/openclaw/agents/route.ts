// OpenClaw Agents API
import { NextRequest, NextResponse } from 'next/server';
import { getGatewayClient } from '@/lib/openclaw/gateway-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get('agentId');
    
    const gatewayClient = getGatewayClient();
    
    if (agentId) {
      // Get specific agent
      const agent = await gatewayClient.getAgent(agentId);
      return NextResponse.json({
        success: true,
        data: agent,
        timestamp: new Date().toISOString(),
        source: 'openclaw-gateway',
      });
    } else {
      // List all agents
      const agents = await gatewayClient.listAgents();
      return NextResponse.json({
        success: true,
        data: agents,
        count: agents.length,
        timestamp: new Date().toISOString(),
        source: 'openclaw-gateway',
      });
    }
  } catch (error) {
    console.error('OpenClaw agents API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch OpenClaw agents',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    }, { status: 500 });
  }
}