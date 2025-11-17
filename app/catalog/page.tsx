'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TreePine } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { ProductFilters } from '@/components/catalog/ProductFilters'

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
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
}

export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'price'>('popular')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    // Проверяем параметры из URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const categoryParam = urlParams.get('category')
      if (categoryParam) {
        setSelectedCategory(categoryParam)
      }
    }
  }, [])

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

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url = selectedCategory
        ? `/api/products?categoryId=${selectedCategory}`
        : '/api/products'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setAllProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  // Подсчет товаров по категориям
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProducts.forEach((product) => {
      counts[product.category.id] = (counts[product.category.id] || 0) + 1
    })
    return counts
  }, [allProducts])

  // Фильтрация и сортировка товаров
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Фильтр по наличию
    if (showInStockOnly) {
      filtered = filtered.filter((p) => p.inStock)
    }

    // Фильтр по цене
    if (minPrice) {
      const min = parseFloat(minPrice)
      if (!isNaN(min)) {
        filtered = filtered.filter((p) => p.price >= min)
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice)
      if (!isNaN(max)) {
        filtered = filtered.filter((p) => p.price <= max)
      }
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

    return sorted
  }, [allProducts, showInStockOnly, minPrice, maxPrice, sortBy, sortOrder])

  const handleResetFilters = () => {
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    setShowInStockOnly(true)
    setSortBy('popular')
    setSortOrder('asc')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="mb-8 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-horror-glow mb-4 flex items-center gap-2 sm:gap-3">
            <TreePine className="w-8 h-8 sm:w-12 sm:h-12" />
            <span className="break-words">КАТАЛОГ ЁЛОК</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Выберите свою идеальную ёлку из тёмных лесов
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-20">
        {/* Категории - показываем только если не выбрана категория */}
        {!selectedCategory && (
          <div className="mb-12">
            <h2 className="horror-text text-2xl sm:text-3xl md:text-4xl text-horror-glow mb-6 sm:mb-8 text-center">
              МАГАЗИН ЁЛОК
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {categories
                .filter((cat) => !cat.parentId)
                .map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/catalog/category/${category.slug}`}>
                      <Card hover className="h-full flex flex-col cursor-pointer">
                        <div className="relative w-full h-64 sm:h-80 mb-4 overflow-hidden bg-horror-dark">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><TreePine class="w-24 h-24 text-gray-600" /></div>'
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <TreePine className="w-24 h-24 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl text-horror-glow mb-2 text-center">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-400 mb-4 text-center">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Фильтры и сортировка - показываем если выбрана категория или есть товары */}
        {(selectedCategory || allProducts.length > 0) && (
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              setMinPrice(min)
              setMaxPrice(max)
            }}
            showInStockOnly={showInStockOnly}
            onStockFilterChange={setShowInStockOnly}
            onReset={handleResetFilters}
            categoryCounts={categoryCounts}
            totalCount={allProducts.length}
          />
        )}

        {/* Товары */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Загрузка...</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">Товары не найдены</p>
            <p className="text-gray-500 text-sm">
              Попробуйте изменить параметры фильтров
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Найдено товаров: <span className="text-horror-glow font-bold">{filteredAndSortedProducts.length}</span>
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
      </div>
    </div>
  )
}
