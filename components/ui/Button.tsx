'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'horror' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'font-horror transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      default: 'horror-border hover:horror-glow bg-horror-dark',
      horror: 'bg-horror-red hover:bg-horror-blood horror-glow text-white',
      ghost: 'hover:horror-glow border-transparent',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
      md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
      lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

