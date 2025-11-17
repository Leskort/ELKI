'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CartModal } from './CartModal'

export function CartIcon() {
  const { getTotalItems } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const totalItems = getTotalItems()

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative"
        aria-label="Корзина"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 text-horror-glow hover:text-horror-glow/80 transition-colors"
        >
          <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
          
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-horror-red text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-horror-red/50"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>
      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
