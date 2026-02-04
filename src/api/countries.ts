
import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'
import { useCountryStore } from '@/store/country'

export interface CountryVO {
  id: number
  name: string
  chineseName?: string
  alpha2: string
  alpha3: string
  countryCode: string
  iso31662: string
  region: string
  subRegion: string
  intermediateRegion: string
  regionCode: number
  subRegionCode: number
  intermediateRegionCode: number
}

export interface CountryPageRequest {
  pageNum: number
  pageSize: number
  orderBy?: string
  alpha2?: string
  name?: string
  region?: string
  subRegion?: string
}

export interface CountryUpdateDTO {
  alpha2: string
  name?: string
  chineseName?: string
  alpha3?: string
  countryCode?: string
  iso31662?: string
  region?: string
  subRegion?: string
  intermediateRegion?: string
  regionCode?: number
  subRegionCode?: number
  intermediateRegionCode?: number
}

export function pageCountries(req: CountryPageRequest) :Promise<ApiResponse<PageResponse<CountryVO>>> {
  return  instance.post('/admin/countries/page', req)
}

export function getCountry(alpha2: string) :Promise<ApiResponse<CountryVO>> {
  return instance.get('/admin/countries/get', { params: { alpha2 } })
}

export function saveCountry(dto: CountryUpdateDTO) :Promise<ApiResponse<boolean>> {
  return instance.post('/admin/countries/save', dto)
}

export async function countryOptions(): Promise<CountryVO[]> {
  const store = useCountryStore()
  return store.fetchCountries()
}
