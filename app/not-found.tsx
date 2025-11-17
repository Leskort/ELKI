import Link from 'next/link'
import { TreePine, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <TreePine className="w-24 h-24 text-horror-glow mx-auto mb-6 animate-float" />
        <h1 className="horror-text text-6xl md:text-8xl text-horror-glow mb-4">
          404
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          Страница потерялась в тёмных лесах...
        </p>
        <Link href="/">
          <Button variant="horror" size="lg" className="flex items-center gap-2 mx-auto">
            <Home className="w-5 h-5" />
            Вернуться домой
          </Button>
        </Link>
      </div>
    </div>
  )
}

