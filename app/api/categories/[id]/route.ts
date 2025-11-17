import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { categorySchema } from '@/lib/validations/category'
import { staticCategories, staticProducts } from '@/lib/data/static-data'

// Проверка доступности базы данных
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

// GET - получить категорию по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем доступность базы данных
    const dbAvailable = await isDatabaseAvailable()
    
    if (!dbAvailable) {
      // Используем статические данные
      const category = staticCategories.find(c => c.id === params.id || c.slug === params.id)
      if (!category) {
        return NextResponse.json(
          { error: 'Категория не найдена' },
          { status: 404 }
        )
      }
      // Добавляем продукты из статических данных
      const products = staticProducts.filter(p => p.categoryId === category.id)
      return NextResponse.json({
        ...category,
        products,
      })
    }

    // Используем базу данных
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      },
      include: {
        parent: true,
        children: true,
        products: true,
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    // В случае ошибки пытаемся найти в статических данных
    const category = staticCategories.find(c => c.id === params.id || c.slug === params.id)
    if (category) {
      const products = staticProducts.filter(p => p.categoryId === category.id)
      return NextResponse.json({
        ...category,
        products,
      })
    }
    return NextResponse.json(
      { error: 'Ошибка при получении категории' },
      { status: 500 }
    )
  }
}

// PUT - обновить категорию
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const data = categorySchema.parse(body)

    // Проверка существования категории
    const existing = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    // Проверка уникальности slug (если изменился)
    if (data.slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Категория с таким slug уже существует' },
          { status: 400 }
        )
      }
    }

    // Проверка на циклические зависимости
    if (data.parentId === params.id) {
      return NextResponse.json(
        { error: 'Категория не может быть родителем самой себя' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        parentId: data.parentId || null,
      },
      include: {
        parent: true,
        children: true,
      }
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      )
    }

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении категории' },
      { status: 500 }
    )
  }
}

// DELETE - удалить категорию
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        children: true,
        products: true,
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    // Проверка на наличие дочерних категорий или товаров
    if (category.children.length > 0) {
      return NextResponse.json(
        { error: 'Нельзя удалить категорию с подкатегориями' },
        { status: 400 }
      )
    }

    if (category.products.length > 0) {
      return NextResponse.json(
        { error: 'Нельзя удалить категорию с товарами' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Категория удалена' })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении категории' },
      { status: 500 }
    )
  }
}

