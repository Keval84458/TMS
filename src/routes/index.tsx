import { createFileRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import OwnerDashboard from '#/components/OwnerDashboard'
import QuickActions from '#/components/QuickActions'

export const Route = createFileRoute('/')({ component: Home })
function Home() {
  return (
    <div className="min-h-screen bg-purple-100 pb-5 pt-4 md:pt-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <OwnerDashboard />
        <QuickActions />
        <Footer />
      </div>
    </div>
  )
}

export default Home