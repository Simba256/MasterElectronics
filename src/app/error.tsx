'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-red-600">Error</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-600">An unexpected error occurred. Please try again.</p>
        <div className="mt-8">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  )
}
