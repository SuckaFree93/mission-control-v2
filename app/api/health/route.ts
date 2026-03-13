import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Mission Control v2',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      dashboard: '/',
      mobileAccess: '/mobile-access.html',
      api: {
        health: '/api/health',
        // Add more API endpoints as they're created
      }
    }
  });
}