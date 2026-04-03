'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admin/faqs')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <p className="text-foreground/60">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}
