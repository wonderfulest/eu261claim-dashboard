import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'

export interface AirlineVO {
  id: number
  code: string
  icaoCode?: string | null
  type?: string | null
  countryCode?: string | null
  name?: string | null
  chineseName?: string | null
  locales?: string | null
  website?: string | null
  eu261Eligible?: number | null
  status?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface AirlinePageRequest {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  code?: string
  countryCode?: string
  eu261Eligible?: number
  status?: string
}

export interface AirlineUpdateDTO {
  code: string
  icaoCode?: string | null
  type?: string | null
  countryCode?: string | null
  name?: string | null
  chineseName?: string | null
  locales?: string | null
  website?: string | null
  eu261Eligible?: number | null
  status?: string | null
}

export const pageAirlines = (
  req: AirlinePageRequest
): Promise<ApiResponse<PageResponse<AirlineVO>>> => {
  return instance.post('/admin/airlines/page', req)
}

export const getAirline = (code: string): Promise<ApiResponse<AirlineVO>> => {
  return instance.get('/admin/airlines/get', { params: { code } })
}

export const saveAirline = (dto: AirlineUpdateDTO): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/airlines/save', dto)
}

export const updateAirlineEu261 = (
  code: string,
  eu261Eligible: number
): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/airlines/update-eu261', undefined, { params: { code, eu261Eligible } })
}
