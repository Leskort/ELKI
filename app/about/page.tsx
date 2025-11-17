'use client'

import { motion } from 'framer-motion'
import { TreePine, Skull, Sparkles, Moon } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Navbar />

      <main className="container mx-auto px-4 py-20 pt-28 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="horror-text text-4xl sm:text-5xl md:text-7xl text-horror-glow mb-8 text-center px-4">
            О НАС
          </h1>

          <div className="space-y-12">
            {/* История */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-4 flex items-center gap-3">
                <Moon className="w-6 h-6 sm:w-8 sm:h-8" />
                Наша история
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                В самых тёмных уголках белорусских лесов, где лунный свет едва пробивается сквозь густые ветви, 
                мы находим особенные ёлки. Каждая из них имеет свою историю, свой характер и свою магию.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Мы не просто продаём ёлки — мы предлагаем вам прикоснуться к тайне тёмных лесов, 
                принести в дом частичку той мистической атмосферы, которая окружает эти величественные деревья.
              </p>
            </section>

            {/* Философия */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-4 flex items-center gap-3">
                <Skull className="w-6 h-6 sm:w-8 sm:h-8" />
                Наша философия
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div>
                  <h3 className="text-xl text-horror-glow mb-2">Уникальность</h3>
                  <p className="text-gray-400">
                    Каждая ёлка в нашем каталоге уникальна. Мы не используем массовое производство — 
                    только индивидуальный подход к каждому дереву.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl text-horror-glow mb-2">Качество</h3>
                  <p className="text-gray-400">
                    Мы тщательно отбираем каждую ёлку, проверяя её здоровье, форму и энергетику. 
                    Только лучшие деревья попадают в наш каталог.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl text-horror-glow mb-2">Атмосфера</h3>
                  <p className="text-gray-400">
                    Мы создаём не просто интерьер — мы создаём атмосферу. Каждая ёлка принесёт 
                    в ваш дом особую энергетику тёмных лесов.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl text-horror-glow mb-2">Традиции</h3>
                  <p className="text-gray-400">
                    Мы чтим традиции и знаем секреты, передаваемые из поколения в поколение. 
                    Наш опыт — это годы работы с живыми деревьями.
                  </p>
                </div>
              </div>
            </section>

            {/* Процесс */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                Как мы работаем
              </h2>
              <div className="space-y-4 mt-6">
                <div className="flex gap-4">
                  <span className="text-horror-glow text-2xl font-bold">1.</span>
                  <div>
                    <h3 className="text-xl text-horror-glow mb-1">Поиск</h3>
                    <p className="text-gray-400">
                      Мы отправляемся в самые отдалённые уголки лесов, где растут самые особенные ёлки.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-horror-glow text-2xl font-bold">2.</span>
                  <div>
                    <h3 className="text-xl text-horror-glow mb-1">Отбор</h3>
                    <p className="text-gray-400">
                      Каждое дерево проходит тщательный отбор по множеству критериев: форма, здоровье, энергетика.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-horror-glow text-2xl font-bold">3.</span>
                  <div>
                    <h3 className="text-xl text-horror-glow mb-1">Подготовка</h3>
                    <p className="text-gray-400">
                      Мы бережно готовим каждую ёлку к транспортировке, сохраняя её свежесть и жизненную силу.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-horror-glow text-2xl font-bold">4.</span>
                  <div>
                    <h3 className="text-xl text-horror-glow mb-1">Доставка</h3>
                    <p className="text-gray-400">
                      Ваша ёлка доставляется в специальных условиях, чтобы сохранить её уникальные свойства.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Призыв к действию */}
            <section className="horror-border p-4 sm:p-8 text-center">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-4">
                Готовы найти свою ёлку?
              </h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Исследуйте наш каталог и найдите ту самую ёлку, которая станет частью вашего дома
              </p>
              <Link
                href="/catalog"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-horror-red hover:bg-horror-blood horror-text text-lg sm:text-xl horror-glow transition-all"
              >
                ПЕРЕЙТИ В КАТАЛОГ
              </Link>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="horror-border-t mt-20 backdrop-blur-sm bg-horror-dark/30">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p className="mb-2">© 2024 Ёлки из Тьмы. Все права защищены.</p>
          <p className="text-sm">Цены в белорусских рублях (BYN)</p>
        </div>
      </footer>
    </div>
  )
}

