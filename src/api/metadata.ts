import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'

export interface EnumOption {
  name: string
  value: string
  category?: string | null
  description?: string | null
  props?: Record<string, any>
}

export interface TableColumn {
  field: string
  type: string
  comment: string
  enumName?: string | null
  enumOptions?: EnumOption[] | null
}

export const getCustomerProfileColumns = (): Promise<ApiResponse<TableColumn[]>> => {
  return instance.get('/admin/metadata/columns?table=customer_profile')
}
