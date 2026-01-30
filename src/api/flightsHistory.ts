import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'

export interface FlightSearchResultVO {
  // 航班号（IATA，如 FR1234 / TG6106 / AA2171）
  flightNumber: string

  // 航班日期（字符串形式 yyyy-MM-dd）
  flightDate: string

  // 计划起飞/到达时间（STD / STA）
  std: string | null
  sta: string | null

  // 实际关键时间（可理解为实际起飞或到达时间，优先到达实时时间）
  actualTime: string | null

  // 航班状态（如 SCHEDULED / ACTIVE / LANDED / CANCELLED 等）
  status: string | null

  // 航司与机场信息
  airlineName: string | null
  airlineCode: string | null
  departureAirportIata: string | null
  departureAirportName: string | null
  arrivalAirportIata: string | null
  arrivalAirportName: string | null

  // 到达延误分钟
  arrivalDelayMinutes: number | null

  // 前端展示的操作建议（暂留）
  action: string | null
}

export interface FlightsHistoryPageRequest {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  flightNumber?: string
  flightIata?: string
  flightDate?: string
}

export interface SyncResult {
  totalFetched?: number
  totalSaved?: number
  hasMore?: boolean
}

export const pageFlightsHistory = (
  req: FlightsHistoryPageRequest
): Promise<ApiResponse<PageResponse<FlightSearchResultVO>>> => {
  return instance.post('/admin/flights/history/page', req)
}

export const syncFlightsHistoryByNumber = (
  req: FlightsHistoryPageRequest
): Promise<ApiResponse<SyncResult>> => {
  return instance.post('/admin/flights/history/sync-by-number', req)
}
