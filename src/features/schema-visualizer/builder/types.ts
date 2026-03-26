export type ZodTypeName = 'string' | 'number' | 'boolean' | 'enum' | 'date'

export interface ValidatorDef {
  name: string
  arg?: number | string
}

export interface FieldDef {
  id: string
  name: string
  type: ZodTypeName | null
  validators: ValidatorDef[]
  enumValues: string[]
}
