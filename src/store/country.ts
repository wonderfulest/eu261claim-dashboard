import { defineStore } from 'pinia'
import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'
import type { CountryVO } from '@/api/countries'

interface CountryState {
  list: CountryVO[]
  loaded: boolean
  loading: boolean
  error: string | null
}

export const useCountryStore = defineStore('country', {
  state: (): CountryState => ({
    list: [],
    loaded: false,
    loading: false,
    error: null
  }),
  actions: {
    async fetchCountries(force = false): Promise<CountryVO[]> {
      if (this.loaded && !force) return this.list
      if (this.loading) return this.list
      this.loading = true
      this.error = null
      try {
        const res: ApiResponse<CountryVO[]> = await instance.get('/admin/countries/options')
        console.log('fetchCountries', res)
        this.list = res.data ?? []
        this.loaded = true
      } catch (e: any) {
        this.error = e?.message || '获取国家列表失败'
      } finally {
        this.loading = false
      }
      return this.list
    }
  }
})
