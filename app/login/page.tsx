'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TreePine } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlowEffect } from '@/components/ui/GlowEffect'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error('Ошибка входа:', result.error)
        setError('Неверный email или пароль')
      } else if (result?.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Произошла ошибка при входе')
      }
    } catch (err) {
      console.error('Исключение при входе:', err)
      setError('Произошла ошибка при входе')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <GlowEffect>
        <div className="horror-border p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <TreePine className="w-16 h-16 text-horror-glow mx-auto mb-4 animate-float" />
            <h1 className="horror-text text-3xl text-horror-glow flicker">
              ВХОД
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-300">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-horror-red text-sm text-center p-2 horror-border-red">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="horror"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'ВХОД...' : 'ВОЙТИ'}
            </Button>
          </form>
        </div>
      </GlowEffect>
    </div>
  )
}

