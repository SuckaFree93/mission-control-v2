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

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}