'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ProductFiltersProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    parentId?: string
    parent?: { name: string }
  }>
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  sortBy: 'popular' | 'name' | 'price'
  onSortChange: (sort: 'popular' | 'name' | 'price') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  minPrice: string
  maxPrice: string
  onPriceChange: (min: string, max: string) => void
  showInStockOnly: boolean
  onStockFilterChange: (show: boolean) => void
  onReset: () => void
  categoryCounts?: Record<string, number>
  totalCount?: number
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  minPrice,
  maxPrice,
  onPriceChange,
  showInStockOnly,
  onStockFilterChange,
  onReset,
  categoryCounts = {},
  totalCount = 0,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasActiveFilters = selectedCategory || minPrice || maxPrice || showInStockOnly

  const mainCategories = categories.filter((cat) => !cat.parentId)

  return (
    <div className="mb-8">
      {/* Кнопка открытия фильтров на мобильных */}
      <div className="md:hidden mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-horror-dark/80 to-horror-darker/80 border border-white/10"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-horror-glow" />
            <span className="font-semibold">Фильтры и сортировка</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-horror-red text-white text-xs font-bold">
                Активно
              </span>
            )}
          </div>
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Панель фильтров */}
      <AnimatePresence>
        {(isOpen || typeof window === 'undefined' || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Категории - премиум табы */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-horror-glow" />
                <h3 className="text-lg sm:text-xl text-horror-glow font-bold">Категории</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryChange('')}
                  className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                    selectedCategory === ''
                      ? 'bg-gradient-to-r from-horror-glow/30 to-horror-glow/20 text-horror-glow border-2 border-horror-glow shadow-lg shadow-horror-glow/30'
                      : 'bg-horror-dark/50 text-gray-300 border-2 border-white/10 hover:border-horror-glow/30 hover:text-horror-glow'
                  }`}
                >
                  ВСЕ ({totalCount})
                </motion.button>
                {mainCategories.map((category) => {
                  const count = categoryCounts[category.id] || 0
                  if (count === 0) return null
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCategoryChange(category.id)}
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

            {/* Сортировка и дополнительные фильтры */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-horror-dark/80 via-horror-dark/60 to-horror-darker/80 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Сортировка */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300 font-medium">Сортировка</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => onSortChange(e.target.value as 'popular' | 'name' | 'price')}
                      className="flex-1 px-4 py-2 rounded-lg bg-horror-dark/50 border border-white/10 text-gray-300 focus:border-horror-glow focus:outline-none transition-colors"
                    >
                      <option value="popular">По популярности</option>
                      <option value="name">По названию</option>
                      <option value="price">По цене</option>
                    </select>
                    <button
                      onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-4 py-2 rounded-lg bg-horror-dark/50 border border-white/10 hover:border-horror-glow text-gray-300 hover:text-horror-glow transition-colors flex items-center justify-center"
                      title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Фильтр по цене */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300 font-medium">Цена (Br)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={minPrice}
                      onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                      className="flex-1 px-4 py-2 rounded-lg bg-horror-dark/50 border border-white/10 text-gray-300 focus:border-horror-glow focus:outline-none transition-colors"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={maxPrice}
                      onChange={(e) => onPriceChange(minPrice, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-horror-dark/50 border border-white/10 text-gray-300 focus:border-horror-glow focus:outline-none transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                {/* Фильтр по наличию */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300 font-medium">Наличие</label>
                  <select
                    value={showInStockOnly ? 'inStock' : 'all'}
                    onChange={(e) => onStockFilterChange(e.target.value === 'inStock')}
                    className="w-full px-4 py-2 rounded-lg bg-horror-dark/50 border border-white/10 text-gray-300 focus:border-horror-glow focus:outline-none transition-colors"
                  >
                    <option value="all">Все товары</option>
                    <option value="inStock">Только в наличии</option>
                  </select>
                </div>
              </div>

              {/* Активные фильтры */}
              {hasActiveFilters && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Активные фильтры:</p>
                    <button
                      onClick={onReset}
                      className="text-sm text-gray-400 hover:text-horror-red transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Сбросить все
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategory && (
                      <span className="px-3 py-1 rounded-full bg-horror-glow/20 text-horror-glow text-xs border border-horror-glow/50">
                        {categories.find((c) => c.id === selectedCategory)?.name}
                        <button
                          onClick={() => onCategoryChange('')}
                          className="ml-2 hover:text-horror-red"
                        >
                          <X className="w-3 h-3 inline" />
                        </button>
                      </span>
                    )}
                    {(minPrice || maxPrice) && (
                      <span className="px-3 py-1 rounded-full bg-horror-glow/20 text-horror-glow text-xs border border-horror-glow/50">
                        Цена: {minPrice || '0'} - {maxPrice || '∞'} Br
                        <button
                          onClick={() => onPriceChange('', '')}
                          className="ml-2 hover:text-horror-red"
                        >
                          <X className="w-3 h-3 inline" />
                        </button>
                      </span>
                    )}
                    {showInStockOnly && (
                      <span className="px-3 py-1 rounded-full bg-horror-glow/20 text-horror-glow text-xs border border-horror-glow/50">
                        Только в наличии
                        <button
                          onClick={() => onStockFilterChange(false)}
                          className="ml-2 hover:text-horror-red"
                        >
                          <X className="w-3 h-3 inline" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
