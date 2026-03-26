export interface SchemaPreset {
  id: string
  label: string
  schema: string
}

export const PRESETS: SchemaPreset[] = [
  {
    id: 'user-profile',
    label: 'User Profile',
    schema: `z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).max(99),
  role: z.enum(["admin", "user", "guest"]),
  isActive: z.boolean(),
})`,
  },
  {
    id: 'bank-transfer',
    label: 'Bank Transfer',
    schema: `z.object({
  fromAccount: z.string().length(10),
  toAccount: z.string().length(10),
  amount: z.number().positive(),
  currency: z.enum(["USD", "EUR", "GBP", "JPY"]),
  isUrgent: z.boolean(),
})`,
  },
  {
    id: 'nasa-asteroid',
    label: 'NASA Asteroid',
    schema: `z.object({
  name: z.string(),
  isPotentiallyHazardous: z.boolean(),
  estimatedDiameterKm: z.number().positive(),
  closeApproachDate: z.string(),
  missDistanceKm: z.number().positive(),
})`,
  },
  {
    id: 'product',
    label: 'Product',
    schema: `z.object({
  title: z.string().min(3).max(100),
  price: z.number().positive(),
  category: z.enum(["electronics", "clothing", "food", "books"]),
  stock: z.number().int().min(0),
  isAvailable: z.boolean(),
})`,
  },
]
