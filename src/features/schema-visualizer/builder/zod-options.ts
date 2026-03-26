import type { ZodTypeName } from './types'

export interface ZodTypeOption {
  value: ZodTypeName
  label: string
  hint: string
}

export interface ValidatorOption {
  name: string
  label: string
  requiresArg: boolean
  argType?: 'number' | 'string'
  defaultArg?: number | string
}

export const ZOD_TYPES: ZodTypeOption[] = [
  { value: 'string',  label: 'string',  hint: 'z.string()'    },
  { value: 'number',  label: 'number',  hint: 'z.number()'    },
  { value: 'boolean', label: 'boolean', hint: 'z.boolean()'   },
  { value: 'enum',    label: 'enum',    hint: 'z.enum([...])' },
  { value: 'date',    label: 'date',    hint: 'z.date()'      },
]

export const VALIDATORS_BY_TYPE: Record<ZodTypeName, ValidatorOption[]> = {
  string: [
    { name: 'min',      label: 'min(n)',    requiresArg: true,  argType: 'number', defaultArg: 1   },
    { name: 'max',      label: 'max(n)',    requiresArg: true,  argType: 'number', defaultArg: 100 },
    { name: 'email',    label: 'email()',   requiresArg: false },
    { name: 'url',      label: 'url()',     requiresArg: false },
    { name: 'optional', label: 'optional()',requiresArg: false },
  ],
  number: [
    { name: 'int',      label: 'int()',     requiresArg: false },
    { name: 'positive', label: 'positive()',requiresArg: false },
    { name: 'min',      label: 'min(n)',    requiresArg: true,  argType: 'number', defaultArg: 0   },
    { name: 'max',      label: 'max(n)',    requiresArg: true,  argType: 'number', defaultArg: 100 },
    { name: 'optional', label: 'optional()',requiresArg: false },
  ],
  boolean: [
    { name: 'optional', label: 'optional()',requiresArg: false },
  ],
  enum: [
    { name: 'optional', label: 'optional()',requiresArg: false },
  ],
  date: [
    { name: 'optional', label: 'optional()',requiresArg: false },
  ],
}
