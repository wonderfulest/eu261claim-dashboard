import type { CountryVO } from '@/api/countries'

/**
 * 统一国家/地区展示：
 * CN - China/中国
 */
export function formatCountryDisplay(
  alpha2?: string | null,
  name?: string | null,
  chineseName?: string | null
): string {
  if (!alpha2 && !name && !chineseName) return '-'
  const parts = [name, chineseName].filter(Boolean).join('/')
  if (!alpha2) return parts || '-'
  return parts ? `${alpha2} - ${parts}` : alpha2
}

/**
 * 从国家列表中根据 alpha2 找到对应 CountryVO
 */
export function findCountryByAlpha2(list: CountryVO[], alpha2?: string | null): CountryVO | undefined {
  if (!alpha2) return undefined
  return list.find(item => item.alpha2 === alpha2)
}
