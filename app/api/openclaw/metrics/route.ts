// OpenClaw Gateway Metrics API
import { NextRequest, NextResponse } from 'next/server';
import { getGatewayClient } from '@/lib/openclaw/gateway-client';

export async function GET(request: NextRequest) {
  try {
    const gatewayClient = getGatewayClient();
    const metrics = await gatewayClient.getMetrics();
    
    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    });
  } catch (error) {
    console.error('OpenClaw metrics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch OpenClaw gateway metrics',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    }, { status: 500 });
  }
}