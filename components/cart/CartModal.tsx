'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils/format'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { TreePine } from 'lucide-react'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart()
  const [isClearing, setIsClearing] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Убеждаемся, что компонент смонтирован (для SSR)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Блокируем скролл страницы когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClearCart = async () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      setIsClearing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      clearCart()
      setIsClearing(false)
    }
  }

  const handleCheckout = () => {
    onClose()
    // Можно добавить переход на страницу оформления заказа
    // window.location.href = '/checkout'
  }

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px] z-[100000] bg-horror-dark horror-border-l shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="horror-border-b p-4 sm:p-6 bg-horror-dark/95 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-horror-glow" />
                  <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow">
                    КОРЗИНА
                  </h2>
                  {getTotalItems() > 0 && (
                    <span className="px-3 py-1 rounded-full bg-horror-glow/20 text-horror-glow text-sm font-bold border border-horror-glow/50">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-horror-dark/50 transition-colors text-gray-400 hover:text-horror-glow"
                  aria-label="Закрыть"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-400">
                {getTotalItems() === 0 
                  ? 'Ваша корзина пуста' 
                  : `${getTotalItems()} ${getTotalItems() === 1 ? 'товар' : getTotalItems() < 5 ? 'товара' : 'товаров'}`}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <TreePine className="w-24 h-24 text-gray-600/50 mb-6" />
                  <p className="text-gray-400 text-lg mb-4">Ваша корзина пуста</p>
                  <Link href="/catalog" onClick={onClose}>
                    <Button variant="horror" size="lg">
                      Перейти в каталог
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="horror-border p-4 bg-horror-dark/50 backdrop-blur-sm rounded-lg"
                    >
                      <div className="flex gap-4">
                        {/* Изображение */}
                        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-md horror-border">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-horror-dark">
                              <TreePine className="w-10 h-10 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* Информация */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg text-horror-glow mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-lg sm:text-xl text-horror-red font-bold mb-3">
                            {formatPrice(item.price)}
                          </p>

                          {/* Управление количеством */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 border border-white/20 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1.5 hover:bg-horror-dark/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-400 hover:text-horror-glow"
                                aria-label="Уменьшить количество"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1.5 text-white font-bold min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-horror-dark/50 transition-colors text-gray-400 hover:text-horror-glow"
                                aria-label="Увеличить количество"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 hover:bg-horror-red/20 transition-colors text-horror-red hover:text-horror-blood rounded-lg"
                              aria-label="Удалить товар"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="horror-border-t p-4 sm:p-6 bg-horror-dark/95 backdrop-blur-md space-y-4"
              >
                {/* Итого */}
                <div className="flex justify-between items-center text-xl sm:text-2xl mb-4">
                  <span className="text-gray-300 font-bold">Итого:</span>
                  <span className="text-horror-red font-bold text-2xl sm:text-3xl">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Кнопки */}
                <div className="space-y-2">
                  <Button
                    variant="horror"
                    size="lg"
                    className="w-full text-lg sm:text-xl py-4 flex items-center justify-center gap-2"
                    onClick={handleCheckout}
                  >
                    ОФОРМИТЬ ЗАКАЗ
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  <Link href="/cart" onClick={onClose} className="block">
                    <Button
                      variant="ghost"
                      size="md"
                      className="w-full"
                    >
                      Открыть полную корзину
                    </Button>
                  </Link>

                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="w-full text-center text-sm text-gray-500 hover:text-horror-red transition-colors py-2"
                  >
                    {isClearing ? 'Очистка...' : 'Очистить корзину'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Нажимая &quot;Оформить заказ&quot;, вы соглашаетесь с условиями
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
