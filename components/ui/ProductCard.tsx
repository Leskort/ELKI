'use client'

import { HTMLAttributes } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils/format'
import { TreePine, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: {
    id: string
    name: string
    slug: string
    description?: string
    price: number
    image?: string
    inStock: boolean
    category?: {
      id: string
      name: string
    }
  }
  index?: number
}

export function ProductCard({ product, index = 0, className, ...props }: ProductCardProps) {
  const { addToCart, updateQuantity, items } = useCart()
  
  // Проверяем, есть ли товар в корзине
  const cartItem = items.find((item) => item.id === product.id)
  const quantity = cartItem?.quantity || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    })
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity === 0) {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
      })
    } else {
      updateQuantity(product.id, quantity + 1)
    }
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1)
    } else if (quantity === 1) {
      updateQuantity(product.id, 0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className={cn('group relative h-full flex flex-col', className)}
      {...(props as any)}
    >
      <Link 
        href={`/catalog/${product.slug}`}
        className="relative h-full flex flex-col"
      >
        {/* Glass morphism карточка */}
        <div className="relative h-full flex flex-col rounded-2xl overflow-hidden">
          {/* Glass эффект с градиентом */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50" />
          
          {/* Внутреннее свечение */}
          <div className="absolute inset-0 bg-gradient-to-t from-horror-dark/80 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Контент */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Изображение товара */}
            <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-t-2xl bg-gradient-to-br from-horror-dark/50 to-horror-darker/50">
              {product.image ? (
                <>
                  {/* Градиентная маска сверху */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  
                  {/* Изображение */}
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  
                  {/* Overlay при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-t from-horror-glow/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TreePine className="w-24 h-24 text-gray-600/50" />
                </div>
              )}
              
              {/* Статус наличия - премиум бейдж */}
              <div className="absolute top-3 right-3 z-30">
                <div className={cn(
                  'px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg',
                  product.inStock
                    ? 'bg-horror-glow/20 border-horror-glow/50 text-horror-glow'
                    : 'bg-horror-red/20 border-horror-red/50 text-horror-red'
                )}>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      product.inStock ? 'bg-horror-glow shadow-[0_0_8px_rgba(0,255,65,0.6)]' : 'bg-horror-red'
                    )} />
                    <span className="text-xs font-semibold">
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-3 relative z-10">
              {/* Название */}
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 group-hover:text-horror-glow transition-colors duration-300">
                {product.name}
              </h3>

              {/* Описание */}
              {product.description && (
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 flex-1">
                  {product.description}
                </p>
              )}

              {/* Категория (если есть) */}
              {product.category && (
                <p className="text-xs text-gray-500/70 uppercase tracking-wide">
                  {product.category.name}
                </p>
              )}

              {/* Цена и кнопка */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-horror-red mb-0.5">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">за единицу</p>
                </div>
              </div>
            </div>
          </div>

          {/* Блики и отражения */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl" />
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-horror-glow/10 rounded-full blur-3xl" />
          </div>
        </div>
      </Link>
      
                    {/* Управление количеством в корзине */}
                    {quantity > 0 ? (
                      <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-horror-glow/20 backdrop-blur-md border border-horror-glow/50 rounded-full px-2 py-1 shadow-lg shadow-horror-glow/20">
                        <motion.button
                          onClick={handleDecrease}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full bg-horror-dark/50 hover:bg-horror-red/30 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Уменьшить количество"
                          title="Уменьшить количество"
                        >
                          <Minus className="w-4 h-4 text-horror-glow" />
                        </motion.button>
                        <span className="text-horror-glow font-bold min-w-[24px] text-center text-sm">
                          {quantity}
                        </span>
                        <motion.button
                          onClick={handleIncrease}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full bg-horror-dark/50 hover:bg-horror-glow/30 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Увеличить количество"
                          title="Увеличить количество"
                        >
                          <Plus className="w-4 h-4 text-horror-glow" />
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-horror-glow/20 backdrop-blur-md border border-horror-glow/50 flex items-center justify-center cursor-pointer hover:bg-horror-glow/30 transition-all shadow-lg shadow-horror-glow/20"
                        aria-label="Добавить в корзину"
                        title="Добавить в корзину"
                      >
                        <ShoppingCart className="w-6 h-6 text-horror-glow" />
                      </motion.button>
                    )}
    </motion.div>
  )
}
