import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'

export interface CustomerProfileVO {
  id: number
  customerId: number
  countryCode?: string | null
  customerValueLevel?: string | null
  cooperationIntent?: string | null
  decisionSpeed?: string | null
  priceSensitivity?: string | null
  acquisitionCostLevel?: string | null
  trafficQuality?: string | null
  leadQualityScore?: number | null
  recommendedContactMethod?: string | null
  recommendedLanguage?: string | null
  followUpPriority?: string | null
  followUpCycle?: string | null
  profileSummary?: string | null
  riskNotes?: string | null
  createdAt: string
  updatedAt: string
}

export interface CustomerProfileUpdateDTO {
  countryCode?: string | null
  customerValueLevel?: string | null
  cooperationIntent?: string | null
  decisionSpeed?: string | null
  priceSensitivity?: string | null
  acquisitionCostLevel?: string | null
  trafficQuality?: string | null
  leadQualityScore?: number | null
  recommendedContactMethod?: string | null
  recommendedLanguage?: string | null
  followUpPriority?: string | null
  followUpCycle?: string | null
  profileSummary?: string | null
  riskNotes?: string | null
}

export interface CustomerProfilePageQueryDTO {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  customerId?: number
}

export const pageCustomerProfiles = (data: CustomerProfilePageQueryDTO): Promise<ApiResponse<PageResponse<CustomerProfileVO>>> => {
  return instance.post('/admin/customer/profile/page', data)
}

export const getCustomerProfileDetail = (customerId: number): Promise<ApiResponse<CustomerProfileVO>> => {
  return instance.get('/admin/customer/profile/detail', { params: { customerId } })
}

export const updateCustomerProfile = (customerId: number, data: CustomerProfileUpdateDTO): Promise<ApiResponse<CustomerProfileVO>> => {
  return instance.post(`/admin/customer/profile/update/${customerId}`, data)
}

export const deleteCustomerProfile = (id: number): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/customer/profile/delete', undefined, { params: { id } })
}

export const refreshAllCustomerProfiles = (): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/customer/profile/refresh-all')
}

export const refreshCustomerProfile = (customerId: number): Promise<ApiResponse<boolean>> => {
  return instance.post(`/admin/customer/profile/refresh/${customerId}`)
}
