'use client'

import { useEffect } from 'react'
import { TreePine, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <TreePine className="w-24 h-24 text-horror-red mx-auto mb-6 animate-shake" />
        <h1 className="horror-text text-4xl md:text-6xl text-horror-red mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Произошла ошибка. Попробуйте обновить страницу.
        </p>
        <Button variant="horror" size="lg" onClick={reset} className="flex items-center gap-2 mx-auto">
          <RefreshCw className="w-5 h-5" />
          Попробовать снова
        </Button>
      </div>
    </div>
  )
}

