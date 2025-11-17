'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  _count?: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
  })

  useEffect(() => {
    fetchCategories()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editing ? `/api/categories/${editing.id}` : '/api/categories'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      })

      if (res.ok) {
        fetchCategories()
        setShowForm(false)
        setEditing(null)
        setFormData({ name: '', slug: '', description: '', image: '', parentId: '' })
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Ошибка при сохранении категории')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию? Это действие нельзя отменить.')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCategories()
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при удалении')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Ошибка при удалении категории')
    }
  }

  const handleEdit = (category: Category) => {
    setEditing(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || '',
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ name: '', slug: '', description: '', image: '', parentId: '' })
  }

  const getCategoryPath = (category: Category): string => {
    const parts = [category.name]
    if (category.parent) {
      parts.unshift(category.parent.name)
    }
    return parts.join(' > ')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="horror-text text-4xl text-horror-glow flex items-center gap-2">
          <FolderTree className="w-8 h-8" />
          КАТАЛОГИ
        </h1>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditing(null)
            setFormData({ name: '', slug: '', description: '', image: '', parentId: '' })
          }}
          variant="default"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl mb-2 text-horror-glow">
              {editing ? 'Редактировать категорию' : 'Создать новую категорию'}
            </h2>
            <p className="text-gray-400 text-sm">
              Категории помогают организовать товары в каталоге. Создайте основные разделы (например, &quot;Живые ёлки&quot;) 
              и подкатегории (например, &quot;Ёлки 2-2.5 метра&quot;).
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Название категории *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Живые ёлки"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Название, которое увидят покупатели в каталоге</p>
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                URL-адрес (Slug) *
              </label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="zhivye-elki"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Адрес страницы категории. Используйте только латинские буквы, цифры и дефисы. 
                Будет создан автоматически из названия.
              </p>
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Описание категории
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание категории для покупателей..."
                disabled={loading}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Необязательное описание, которое будет показано на странице категории
              </p>
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Изображение категории (URL)
              </label>
              <Input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/category-image.jpg"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 mb-2">
                Ссылка на изображение, которое будет показано на карточке категории в каталоге
              </p>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover horror-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-gray-300">Родительская категория</label>
              <Select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                disabled={loading}
              >
                <option value="">Без родителя (основная категория)</option>
                {categories
                  .filter(cat => !editing || cat.id !== editing.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryPath(cat)}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" variant="horror" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {categories.length === 0 ? (
          <Card>
            <p className="text-center text-gray-400">Категории не найдены. Создайте первую категорию.</p>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} hover>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl text-horror-glow mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">/{category.slug}</p>
                  {category.description && (
                    <p className="text-gray-300 mb-2">{category.description}</p>
                  )}
                  {category.image && (
                    <div className="mb-2">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-24 h-24 object-cover horror-border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    {category.parent && (
                      <span>Родитель: {category.parent.name}</span>
                    )}
                    {category.children && category.children.length > 0 && (
                      <span>Подкатегорий: {category.children.length}</span>
                    )}
                    {category._count && (
                      <span>Товаров: {category._count.products}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="flex items-center gap-1 text-horror-red hover:text-horror-blood"
                  >
                    <Trash2 className="w-4 h-4" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

