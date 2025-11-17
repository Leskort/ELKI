import { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET не установлен! Это может вызвать проблемы с авторизацией.')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 [NextAuth] Начало авторизации...')
          
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ [NextAuth] Отсутствуют email или пароль')
            return null
          }

          const email = credentials.email.trim().toLowerCase()
          console.log('🔍 [NextAuth] Поиск пользователя:', email)

          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user) {
            console.log('❌ [NextAuth] Пользователь не найден:', email)
            const userCount = await prisma.user.count()
            console.log('📊 [NextAuth] Всего пользователей в БД:', userCount)
            return null
          }

          console.log('✅ [NextAuth] Пользователь найден:', user.email)
          console.log('🔐 [NextAuth] Проверка пароля...')

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            console.log('❌ [NextAuth] Неверный пароль для:', email)
            console.log('🔍 [NextAuth] Хеш пароля в БД:', user.password.substring(0, 20) + '...')
            return null
          }

          console.log('✅ [NextAuth] Авторизация успешна:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error: any) {
          console.error('❌ [NextAuth] Ошибка при авторизации:', error)
          console.error('❌ [NextAuth] Детали ошибки:', {
            message: error.message,
            name: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          })
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development-only-change-in-production',
  debug: process.env.NODE_ENV === 'development',
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return user
}
