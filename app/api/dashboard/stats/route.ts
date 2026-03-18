import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    
    const stats = {
      totalAgents: 12,
      onlineAgents: 8,
      systemHealth: 92,
      activeSessions: 45,
      totalUsers: 156,
      dataProcessed: 1245000000,
      averageResponseTime: 42,
      errorRate: 0.8,
      timestamp: new Date().toISOString(),
    };

    const response = NextResponse.json(stats, { status: 200 });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}