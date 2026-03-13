import { DesktopLayout } from '@/components/layout/desktop-layout'
import { MobileLayout } from '@/components/layout/mobile-layout'

export default function Home() {
  return (
    <>
      {/* Desktop Version (hidden on mobile) */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      
      {/* Mobile Version (hidden on desktop) */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>
    </>
  )
}