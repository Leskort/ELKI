'use client'

import Link from 'next/link'
import { TreePine, Package, FolderTree, TrendingUp, HelpCircle, ArrowRight, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    inStockProducts: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ])

        if (categoriesRes.ok && productsRes.ok) {
          const categories = await categoriesRes.json()
          const products = await productsRes.json()
          setStats({
            categories: categories.length,
            products: products.length,
            inStockProducts: products.filter((p: any) => p.inStock).length,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="horror-text text-4xl md:text-5xl text-horror-glow mb-2 flex items-center gap-3">
          <TreePine className="w-10 h-10 md:w-12 md:h-12" />
          Панель управления магазином
        </h1>
        <p className="text-gray-400 text-lg">
          Управляйте каталогом, товарами и настройками вашего магазина ёлок
        </p>
      </div>

      {/* Статистика */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1 text-sm">Категорий</p>
                <p className="text-4xl text-horror-glow font-bold">{stats.categories}</p>
                <p className="text-xs text-gray-500 mt-1">Основных разделов каталога</p>
              </div>
              <FolderTree className="w-16 h-16 text-horror-glow opacity-30" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1 text-sm">Всего товаров</p>
                <p className="text-4xl text-horror-glow font-bold">{stats.products}</p>
                <p className="text-xs text-gray-500 mt-1">Товаров в каталоге</p>
              </div>
              <Package className="w-16 h-16 text-horror-glow opacity-30" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-1 text-sm">В наличии</p>
                <p className="text-4xl text-horror-glow font-bold">{stats.inStockProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Доступно для покупки</p>
              </div>
              <TrendingUp className="w-16 h-16 text-horror-glow opacity-30" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Быстрые действия */}
      <div>
        <h2 className="text-2xl text-horror-glow mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Управление каталогом
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/categories">
            <Card hover className="h-full group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-horror-glow/20 group-hover:bg-horror-glow/30 transition-colors">
                  <FolderTree className="w-8 h-8 text-horror-glow" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2 text-horror-glow font-bold">Категории и разделы</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Создавайте и управляйте категориями товаров. Например: "Живые ёлки", "Подставки", "Аксессуары"
                  </p>
                  <div className="flex items-center gap-2 text-horror-glow text-sm group-hover:gap-3 transition-all">
                    <span>Открыть</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card hover className="h-full group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-horror-glow/20 group-hover:bg-horror-glow/30 transition-colors">
                  <Package className="w-8 h-8 text-horror-glow" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2 text-horror-glow font-bold">Товары</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Добавляйте новые ёлки, устанавливайте цены, загружайте фотографии и управляйте наличием
                  </p>
                  <div className="flex items-center gap-2 text-horror-glow text-sm group-hover:gap-3 transition-all">
                    <span>Открыть</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Подсказки */}
      <Card className="bg-horror-dark/50 border-horror-glow/30">
        <div className="flex items-start gap-4">
          <HelpCircle className="w-6 h-6 text-horror-glow flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg text-horror-glow mb-2 font-bold">Как начать работу?</h3>
            <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
              <li>
                <strong className="text-horror-glow">Создайте категории:</strong> Сначала создайте основные разделы каталога (например, "Живые ёлки", "Подставки")
              </li>
              <li>
                <strong className="text-horror-glow">Добавьте товары:</strong> После создания категорий добавьте товары с фотографиями, описаниями и ценами
              </li>
              <li>
                <strong className="text-horror-glow">Проверьте наличие:</strong> Убедитесь, что у товаров включен переключатель "В наличии", чтобы они отображались на сайте
              </li>
              <li>
                <strong className="text-horror-glow">Проверьте сайт:</strong> Откройте каталог на сайте, чтобы увидеть, как ваши товары выглядят для покупателей
              </li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  )
}
