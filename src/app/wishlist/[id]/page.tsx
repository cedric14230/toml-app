import { HDWishlist } from '@/components/wishlist/HDWishlist'
import { HMWishlist } from '@/components/wishlist/HMWishlist'

export default function WishlistPage() {
  return (
    <>
      <div className="hidden md:block">
        <HDWishlist />
      </div>
      <div className="md:hidden">
        <HMWishlist />
      </div>
    </>
  )
}
