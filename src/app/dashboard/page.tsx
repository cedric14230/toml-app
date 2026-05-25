import { HDDashboard } from '@/components/dashboard/HDDashboard'
import { HMDashboard } from '@/components/dashboard/HMDashboard'

export default function DashboardPage() {
  return (
    <>
      <div className="hidden md:block">
        <HDDashboard />
      </div>
      <div className="md:hidden">
        <HMDashboard />
      </div>
    </>
  )
}
