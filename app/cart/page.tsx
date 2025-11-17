'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils/format'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const totalPrice = getTotalPrice()

  const handleClearCart = () => {
    if (confirm('Очистить корзину?')) {
      setIsClearing(true)
      clearCart()
      setTimeout(() => setIsClearing(false), 300)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 pt-28 sm:pt-32">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="mb-8"
            >
              <ShoppingCart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            </motion.div>
            <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl text-horror-glow mb-4">
              КОРЗИНА ПУСТА
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Добавьте товары в корзину, чтобы продолжить покупки
            </p>
            <Link href="/catalog">
              <Button variant="horror" size="lg" className="flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-5 h-5" />
                ПЕРЕЙТИ В КАТАЛОГ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl text-horror-glow flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10" />
            КОРЗИНА
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-gray-400 hover:text-horror-red transition-colors"
            >
              Очистить корзину
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Glass карточка товара */}
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-black/50" />
                  
                  <div className="relative z-10 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Изображение */}
                      <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden bg-horror-dark flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/catalog/${item.slug}`}>
                            <h3 className="text-lg sm:text-xl font-bold text-white hover:text-horror-glow transition-colors mb-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xl sm:text-2xl font-bold text-horror-red mb-4">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Управление количеством */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-lg font-bold text-white min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="text-xl font-bold text-horror-glow">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 rounded-lg bg-horror-red/20 hover:bg-horror-red/30 border border-horror-red/50 transition-all"
                              aria-label="Удалить товар"
                            >
                              <Trash2 className="w-5 h-5 text-horror-red" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Итого */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl shadow-black/50" />
                
                <div className="relative z-10 p-6">
                  <h2 className="text-2xl font-bold text-horror-glow mb-6">ИТОГО</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Товаров:</span>
                      <span>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Сумма:</span>
                      <span className="text-xl font-bold text-horror-glow">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>К оплате:</span>
                        <span className="text-2xl text-horror-red">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="horror"
                    size="lg"
                    className="w-full mb-4"
                    onClick={() => {
                      alert('Функционал оформления заказа будет добавлен позже')
                    }}
                  >
                    ОФОРМИТЬ ЗАКАЗ
                  </Button>

                  <Link href="/catalog">
                    <Button variant="ghost" size="lg" className="w-full flex items-center justify-center gap-2">
                      <ArrowLeft className="w-5 h-5" />
                      Продолжить покупки
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

