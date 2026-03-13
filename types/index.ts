export interface Agent {
  id: string
  name: string
  model: string
  status: 'online' | 'offline' | 'busy' | 'idle'
  latency: number
  lastAction: string
  lastActionTime: number
  cpuUsage: number
  memoryUsage: number
}

export interface BuildEvent {
  id: string
  project: string
  status: 'success' | 'failed' | 'building' | 'pending'
  commit: string
  branch: string
  timestamp: number
  duration: number
  deployUrl?: string
}

export interface SystemMetrics {
  cpu: number
  memory: number
  gpu: number
  network: number
  disk: number
  temperature: number
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  shortcut: string
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
}

export interface ActivityLog {
  id: string
  action: string
  user: string
  timestamp: number
  details?: string
}