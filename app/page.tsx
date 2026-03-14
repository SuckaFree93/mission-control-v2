import { CyberpunkDashboard } from '@/components/dashboard/CyberpunkDashboard'
import { MobileLayout } from '@/components/layout/mobile-layout'

export default function Home() {
  return (
    <>
      {/* Cyberpunk Dashboard (hidden on mobile) */}
      <div className="hidden lg:block">
        <CyberpunkDashboard />
      </div>
      
      {/* Mobile Version (hidden on desktop) */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>
    </>
  )
}