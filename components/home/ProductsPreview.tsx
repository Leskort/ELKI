'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'
import { Filter, X, ArrowUpDown } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  image?: string
  inStock: boolean
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
}

export function ProductsPreview() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'price'>('popular')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setAllProducts(data.filter((p: Product) => p.inStock))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Подсчет товаров по категориям
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProducts.forEach((product) => {
      counts[product.category.id] = (counts[product.category.id] || 0) + 1
    })
    return counts
  }, [allProducts])

  // Фильтрация и сортировка
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category.id === selectedCategory)
    }

    // Сортировка
    const sorted = [...filtered]
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => {
          const result = a.name.localeCompare(b.name, 'ru')
          return sortOrder === 'asc' ? result : -result
        })
        break
      case 'price':
        sorted.sort((a, b) => {
          const result = a.price - b.price
          return sortOrder === 'asc' ? result : -result
        })
        break
      case 'popular':
      default:
        // По умолчанию оставляем как есть
        break
    }

    // Показываем максимум 8 товаров
    return sorted.slice(0, 8)
  }, [allProducts, selectedCategory, sortBy, sortOrder])

  const mainCategories = categories.filter((cat) => !cat.parentId)

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Загрузка товаров...</p>
      </div>
    )
  }

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Товары скоро появятся</p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-horror-red hover:bg-horror-blood horror-text text-lg horror-glow transition-all"
        >
          ПЕРЕЙТИ В КАТАЛОГ
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Премиум фильтры */}
      <div className="mb-8 sm:mb-12">
        {/* Категории - табы */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-horror-glow" />
            <h3 className="text-lg sm:text-xl text-horror-glow font-bold">Категории</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-horror-glow/30 to-horror-glow/20 text-horror-glow border-2 border-horror-glow shadow-lg shadow-horror-glow/30'
                  : 'bg-horror-dark/50 text-gray-300 border-2 border-white/10 hover:border-horror-glow/30 hover:text-horror-glow'
              }`}
            >
              ВСЕ ({allProducts.length})
            </motion.button>
            {mainCategories.map((category) => {
              const count = categoryCounts[category.id] || 0
              if (count === 0) return null
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-horror-glow/30 to-horror-glow/20 text-horror-glow border-2 border-horror-glow shadow-lg shadow-horror-glow/30'
                      : 'bg-horror-dark/50 text-gray-300 border-2 border-white/10 hover:border-horror-glow/30 hover:text-horror-glow'
                  }`}
                >
                  {category.name.toUpperCase()} ({count})
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Сортировка */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-horror-dark/80 via-horror-dark/60 to-horror-darker/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-5 h-5 text-horror-glow" />
            <span className="text-gray-300 font-medium">Сортировка:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {(['popular', 'name', 'price'] as const).map((sort) => (
                <motion.button
                  key={sort}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (sortBy === sort) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortBy(sort)
                      setSortOrder('asc')
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    sortBy === sort
                      ? 'bg-horror-glow/20 text-horror-glow border-2 border-horror-glow/50 shadow-lg shadow-horror-glow/20'
                      : 'bg-white/5 text-gray-400 border-2 border-white/10 hover:border-horror-glow/30 hover:text-horror-glow'
                  }`}
                >
                  {sort === 'popular' && 'Популярные'}
                  {sort === 'name' && 'По названию'}
                  {sort === 'price' && 'По цене'}
                  {sortBy === sort && (
                    <span className="ml-2 text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
            {(selectedCategory || sortBy !== 'popular') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory('')
                  setSortBy('popular')
                  setSortOrder('asc')
                }}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 border-2 border-white/10 hover:border-horror-red/50 hover:text-horror-red transition-all duration-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Сбросить
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Товары */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4 text-lg">Товары не найдены по выбранным фильтрам</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory('')
              setSortBy('popular')
            }}
            className="px-6 py-3 rounded-lg bg-horror-glow/20 text-horror-glow border-2 border-horror-glow/50 hover:bg-horror-glow/30 transition-all"
          >
            Сбросить фильтры
          </motion.button>
        </div>
      ) : (
        <>
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              Показано: <span className="text-horror-glow font-bold text-lg">{filteredAndSortedProducts.length}</span> товаров
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </>
      )}

      <div className="text-center mt-8 sm:mt-12">
        <Link
          href="/catalog"
          className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-horror-red to-horror-blood hover:from-horror-blood hover:to-horror-red text-white font-bold text-lg sm:text-xl shadow-lg shadow-horror-red/50 hover:shadow-xl hover:shadow-horror-red/70 transition-all duration-300 transform hover:scale-105"
        >
          СМОТРЕТЬ ВСЕ ТОВАРЫ
        </Link>
      </div>
    </div>
  )
}
