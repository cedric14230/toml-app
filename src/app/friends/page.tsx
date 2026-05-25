import { HDFriends } from '@/components/friends/HDFriends'
import { HMFriends } from '@/components/friends/HMFriends'

export default function FriendsPage() {
  return (
    <>
      <div className="hidden md:block"><HDFriends /></div>
      <div className="md:hidden"><HMFriends /></div>
    </>
  )
}
