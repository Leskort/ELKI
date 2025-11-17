import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'ЁЛКИ | Живые ёлки с характером',
  description: 'Купите живую ёлку, которая запомнится навсегда',
  keywords: 'ёлки, живые ёлки, купить ёлку, беларусь',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="scary-bg min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

