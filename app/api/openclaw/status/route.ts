// OpenClaw Gateway Status API
import { NextRequest, NextResponse } from 'next/server';
import { getGatewayClient } from '@/lib/openclaw/gateway-client';

export async function GET(request: NextRequest) {
  try {
    const gatewayClient = getGatewayClient();
    const status = await gatewayClient.getStatus();
    
    const response = NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error('OpenClaw status API error:', error);
    
    // Return error response
    const response = NextResponse.json({
      success: false,
      error: 'Failed to fetch OpenClaw gateway status',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      source: 'openclaw-gateway',
    }, { status: 500 });
    
    // Add CORS headers even for error responses
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    const gatewayClient = getGatewayClient();
    
    let result;
    switch (action) {
      case 'restart':
        result = await gatewayClient.restartGateway();
        break;
        
      case 'refresh':
        result = await gatewayClient.getStatus();
        break;
        
      default:
        const errorResponse = NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          timestamp: new Date().toISOString(),
        }, { status: 400 });
        
        errorResponse.headers.set('Access-Control-Allow-Origin', '*');
        errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return errorResponse;
    }
    
    const response = NextResponse.json({
      success: true,
      message: action === 'restart' ? 'Gateway restart initiated' : 'Status refreshed',
      data: result,
      timestamp: new Date().toISOString(),
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error('OpenClaw action API error:', error);
    const response = NextResponse.json({
      success: false,
      error: 'Failed to perform action',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
    
    // Add CORS headers even for error responses
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}