import CategoryProducts from '@/components/CategoryProducts'
import React, { Suspense } from 'react'

function page() {
  return (
    <div>
      <Suspense fallback={<p>Loading products...</p>}>
        <CategoryProducts/>
      </Suspense>
    </div>
  )
}

export default page