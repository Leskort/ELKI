import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { categorySchema } from '@/lib/validations/category'
import { staticCategories } from '@/lib/data/static-data'

// Проверка доступности базы данных
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

// GET - получить все категории
export async function GET() {
  try {
    // Проверяем доступность базы данных
    const dbAvailable = await isDatabaseAvailable()
    
    if (!dbAvailable) {
      // Используем статические данные
      return NextResponse.json(staticCategories)
    }

    // Используем базу данных
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    // В случае ошибки возвращаем статические данные
    return NextResponse.json(staticCategories)
  }
}

// POST - создать категорию
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const data = categorySchema.parse(body)

    // Проверка уникальности slug
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Категория с таким slug уже существует' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
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

    return NextResponse.json(category, { status: 201 })
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

    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    )
  }
}

