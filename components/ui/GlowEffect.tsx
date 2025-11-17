'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GlowEffectProps {
  children: React.ReactNode
  intensity?: number
}

export function GlowEffect({ children, intensity = 1 }: GlowEffectProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 65, ${0.1 * intensity}) 0%, transparent 50%)`,
        }}
      />
      {children}
    </div>
  )
}

