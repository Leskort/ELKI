'use client'

import { motion } from 'framer-motion'
import { TreePine, Wrench, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils/format'

const services = [
  {
    id: '1',
    name: 'Установка елки (Минск)',
    slug: 'ustanovka-elki-minsk',
    description: 'Профессиональная установка вашей ёлки. Наши специалисты приедут к вам домой и установят ёлку с соблюдением всех правил безопасности.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
    inStock: true,
    icon: Wrench,
  },
  {
    id: '2',
    name: 'Утилизация елки в январе (Минск)',
    slug: 'utilizatsiya-elki-yanvar-minsk',
    description: 'Экологичная утилизация вашей ёлки после праздников. Мы заберём ёлку и правильно утилизируем её с заботой об окружающей среде.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
    inStock: true,
    icon: Trash2,
  },
]

export default function ServicesPage() {
  const handleAddToCart = (service: typeof services[0]) => {
    // Здесь будет логика добавления в корзину
    alert(`Услуга "${service.name}" добавлена в корзину`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12 pt-24 sm:pt-28">
        {/* Хлебные крошки */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-horror-glow transition-colors">Главная</a></li>
            <li>/</li>
            <li className="text-gray-300">Услуги</li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-horror-glow mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
            <TreePine className="w-8 h-8 sm:w-12 sm:h-12" />
            УСЛУГИ
          </h1>

          {/* Сортировка */}
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-4 text-sm sm:text-base text-gray-400">
            <button className="hover:text-horror-glow transition-colors flex items-center gap-1">
              По популярности
              <span className="text-horror-glow">↑</span>
            </button>
            <button className="hover:text-horror-glow transition-colors flex items-center gap-1">
              По названию
              <span className="text-horror-glow">↑</span>
            </button>
            <button className="hover:text-horror-glow transition-colors">
              По цене
            </button>
          </div>

          {/* Список услуг */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full flex flex-col">
                    {/* Изображение */}
                    {service.image ? (
                      <div className="relative w-full h-48 sm:h-64 mb-4 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-64 mb-4 horror-border flex items-center justify-center bg-horror-dark">
                        <Icon className="w-24 h-24 text-gray-600" />
                      </div>
                    )}

                    {/* Контент */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl sm:text-2xl text-horror-glow mb-2">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm sm:text-base text-gray-400 mb-4 flex-1 line-clamp-3">
                          {service.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${service.inStock ? 'bg-horror-glow' : 'bg-horror-red'}`}></span>
                        <span className={`text-sm ${service.inStock ? 'text-horror-glow' : 'text-horror-red'}`}>
                          {service.inStock ? 'В наличии' : 'Нет в наличии'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t horror-border">
                        <p className="text-2xl sm:text-3xl text-horror-red font-bold">
                          {formatPrice(service.price)}
                        </p>
                        <Button
                          variant="horror"
                          size="sm"
                          onClick={() => handleAddToCart(service)}
                          disabled={!service.inStock}
                          className="text-xs sm:text-sm"
                        >
                          В КОРЗИНУ
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
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

