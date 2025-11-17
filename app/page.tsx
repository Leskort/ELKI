'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TreePine, Skull, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlowEffect } from '@/components/ui/GlowEffect'
import { FlickerText } from '@/components/ui/FlickerText'
import { Navbar } from '@/components/layout/Navbar'
import { ProductsPreview } from '@/components/home/ProductsPreview'

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Фоновое видео */}
      <div className="fixed inset-0 z-0">
        {!videoError && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            onError={() => setVideoError(true)}
          >
            <source src="/videos/horror-background.mp4" type="video/mp4" />
            <source src="/videos/horror-background.webm" type="video/webm" />
          </video>
        )}
        {/* Затемнение для лучшей читаемости */}
        <div className="absolute inset-0 bg-gradient-to-b from-horror-dark/80 via-horror-dark/60 to-horror-darker/80" />
      </div>

      {/* Параллакс эффект */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 65, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Header - должен быть вне main для правильной работы sticky */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 pt-20 sm:pt-24">
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="horror-text text-4xl sm:text-5xl md:text-7xl lg:text-9xl mb-6 text-horror-glow px-4">
              <FlickerText>ЖИВЫЕ ЁЛКИ</FlickerText>
            </h1>
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl mb-4 text-gray-300 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Которые помнят каждую зиму
            </motion.p>
            <motion.p 
              className="text-base sm:text-lg md:text-xl mb-12 text-gray-400 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Каждая ёлка в нашем каталоге прошла через тёмные леса и готова стать частью вашего дома
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="px-4"
            >
              <Link href="/catalog" className="block">
                <Button variant="horror" size="lg" className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 w-full sm:w-auto mx-auto sm:mx-0">
                  ВЫБРАТЬ ЁЛКУ
                  <ArrowRight className="inline ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Декоративные элементы */}
          <motion.div 
            className="mt-12 sm:mt-20 flex justify-center gap-4 sm:gap-8 flex-wrap px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-center"
            >
              <Skull className="w-12 h-12 sm:w-16 sm:h-16 text-horror-glow mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-400">Уникальные</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="text-center"
            >
              <TreePine className="w-12 h-12 sm:w-16 sm:h-16 text-horror-glow mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-400">Живые</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="text-center"
            >
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-horror-glow mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-400">Запоминающиеся</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Секция с товарами */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="horror-text text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-12 text-horror-glow text-center">
              НАШИ ЁЛКИ
            </h2>
            <ProductsPreview />
          </motion.div>
        </section>

        {/* Дополнительная секция */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="horror-border p-6 sm:p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="horror-text text-3xl sm:text-4xl md:text-5xl mb-6 text-horror-glow">
              Почему наши ёлки особенные?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8">
              <div>
                <h3 className="text-xl text-horror-glow mb-2">Тёмное происхождение</h3>
                <p className="text-gray-400">Каждая ёлка выросла в самых тёмных лесах</p>
              </div>
              <div>
                <h3 className="text-xl text-horror-glow mb-2">Живая энергия</h3>
                <p className="text-gray-400">Они помнят каждую зиму и готовы поделиться историей</p>
              </div>
              <div>
                <h3 className="text-xl text-horror-glow mb-2">Уникальный характер</h3>
                <p className="text-gray-400">Ни одна ёлка не похожа на другую</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 horror-border-t mt-20 backdrop-blur-sm bg-horror-dark/30">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p className="mb-2">© 2024 Ёлки из Тьмы. Все права защищены.</p>
          <p className="text-sm">Цены в белорусских рублях (BYN)</p>
        </div>
      </footer>
    </div>
  )
}

