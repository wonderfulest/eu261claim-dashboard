import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'

export interface AirportBasicVO {
  iataCode: string
  icaoCode?: string | null
  airportName?: string | null
  airportNameCn?: string | null
  countryCode?: string | null
  countryName?: string | null
  cityName?: string | null
  timezone?: string | null
  latitude?: number | null
  longitude?: number | null
  airportType?: string | null
  airportSize?: string | null
  status?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface AirportBasicPageRequest {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  iataCode?: string
  countryCode?: string
  cityName?: string
  status?: number
}

export interface AirportBasicUpdateDTO {
  iataCode: string
  icaoCode?: string | null
  airportName?: string | null
  airportNameCn?: string | null
  countryCode?: string | null
  countryName?: string | null
  cityName?: string | null
  timezone?: string | null
  latitude?: number | null
  longitude?: number | null
  airportType?: string | null
  airportSize?: string | null
  status?: number | null
}

export interface AirportEu261ConfigVO {
  iataCode: string
  isInEu?: boolean | null
  eu261Applicable?: boolean | null
  status?: number | null
}

export interface AirportEu261ConfigPageRequest {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  iataCode?: string
  isInEu?: boolean
  eu261Applicable?: boolean
  status?: number
}

export interface AirportEu261ConfigUpdateDTO {
  iataCode: string
  isInEu?: boolean | null
  eu261Applicable?: boolean | null
  status?: number | null
}

export const pageAirportBasic = (
  req: AirportBasicPageRequest
): Promise<ApiResponse<PageResponse<AirportBasicVO>>> => {
  return instance.post('/admin/airports/basic/page', req)
}

export const getAirportBasic = (iataCode: string): Promise<ApiResponse<AirportBasicVO>> => {
  return instance.get('/admin/airports/basic/get', { params: { iataCode } })
}

export const updateAirportBasic = (dto: AirportBasicUpdateDTO): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/airports/basic/update', dto)
}

export const pageAirportConfig = (
  req: AirportEu261ConfigPageRequest
): Promise<ApiResponse<PageResponse<AirportEu261ConfigVO>>> => {
  return instance.post('/admin/airports/config/page', req)
}

export const getAirportConfig = (iataCode: string): Promise<ApiResponse<AirportEu261ConfigVO>> => {
  return instance.get('/admin/airports/config/get', { params: { iataCode } })
}

export const updateAirportConfig = (dto: AirportEu261ConfigUpdateDTO): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/airports/config/update', dto)
}
