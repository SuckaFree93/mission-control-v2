// OpenClaw Gateway Status API
import { NextRequest, NextResponse } from 'next/server';
import { getGatewayClient } from '@/lib/openclaw/gateway-client';

export async function GET(request: NextRequest) {
  try {
    const gatewayClient = getGatewayClient();
    const status = await gatewayClient.getStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    });
  } catch (error) {
    console.error('OpenClaw status API error:', error);
    
    // Return error response
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch OpenClaw gateway status',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    const gatewayClient = getGatewayClient();
    
    switch (action) {
      case 'restart':
        const result = await gatewayClient.restartGateway();
        return NextResponse.json({
          success: true,
          message: 'Gateway restart initiated',
          data: result,
          timestamp: new Date().toISOString(),
        });
        
      case 'refresh':
        const status = await gatewayClient.getStatus();
        return NextResponse.json({
          success: true,
          message: 'Status refreshed',
          data: status,
          timestamp: new Date().toISOString(),
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          timestamp: new Date().toISOString(),
        }, { status: 400 });
    }
  } catch (error) {
    console.error('OpenClaw action API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform action',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}