import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'

export interface FlightQueryRecord {
  id: number
  queryTime: string
  flightDate?: string | null
  flightNumber?: string | null
  airlineCode?: string | null
  departureAirport?: string | null
  arrivalAirport?: string | null
  userId?: number | null
  sessionId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  countryCode?: string | null
  delayMinutes?: number | null
  isEligible?: boolean | null
  resultStatus?: string | null
  claimId?: number | null
}

export interface FlightQueryRecordPageRequest {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  flightDate?: string
  flightNumber?: string
  userId?: number
  sessionId?: string
}

export const pageFlightQueryRecords = (
  req: FlightQueryRecordPageRequest
): Promise<ApiResponse<PageResponse<FlightQueryRecord>>> => {
  return instance.post('/admin/flights/query-record/page', req)
}
