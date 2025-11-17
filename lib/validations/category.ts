import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефисы'),
  description: z.string().optional(),
  image: z.string().url('Неверный URL изображения').optional().or(z.literal('')),
  parentId: z.string().optional().nullable(),
})

export type CategoryInput = z.infer<typeof categorySchema>

