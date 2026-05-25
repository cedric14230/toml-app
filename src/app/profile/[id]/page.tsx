import { HDProfile } from '@/components/profile/HDProfile'
import { HMProfile } from '@/components/profile/HMProfile'

export default function ProfilePage() {
  return (
    <>
      <div className="hidden md:block"><HDProfile /></div>
      <div className="md:hidden"><HMProfile /></div>
    </>
  )
}
