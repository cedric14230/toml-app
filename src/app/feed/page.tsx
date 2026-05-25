import { HDFeed } from '@/components/feed/HDFeed'
import { HMFeed } from '@/components/feed/HMFeed'

export default function FeedPage() {
  return (
    <>
      <div className="hidden md:block"><HDFeed /></div>
      <div className="md:hidden"><HMFeed /></div>
    </>
  )
}
