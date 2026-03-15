import { NextRequest } from 'next/server';

// Simple WebSocket endpoint for now
// In production, this would be upgraded to a WebSocket connection
export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({
      status: 'websocket_endpoint_ready',
      message: 'WebSocket endpoint is configured',
      note: 'For full WebSocket functionality, implement a separate WebSocket server',
      endpoints: {
        health: '/api/health',
        auth: {
          login: '/api/auth/login',
          register: '/api/auth/register',
          logout: '/api/auth/logout',
          validate: '/api/auth/validate'
        },
        agent_monitor: '/api/agent-monitor'
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}