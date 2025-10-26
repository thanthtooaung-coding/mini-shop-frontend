import apiClient from './api'
import type {
  MonthlySalesReport,
  DailySalesSummaryDto,
  CategoryReportDto,
  CustomerReportDto,
} from '@/types/api'

export const getMonthlyReport = async (year: number): Promise<MonthlySalesReport[]> => {
  const response = await apiClient.get<MonthlySalesReport[]>('/reports/monthly', {
    params: { year },
  })
  return response.data
}

export const getDailyReport = async (month: string): Promise<DailySalesSummaryDto[]> => {
  const response = await apiClient.get<DailySalesSummaryDto[]>('/reports/daily', {
    params: { month },
  })
  return response.data
}

export const getCategoryReport = async (
  startDate: string,
  endDate: string,
): Promise<CategoryReportDto[]> => {
  const response = await apiClient.get<CategoryReportDto[]>('/reports/category', {
    params: { startDate, endDate },
  })
  return response.data
}

export const getCustomerReport = async (
  startDate: string,
  endDate: string,
): Promise<CustomerReportDto[]> => {
  const response = await apiClient.get<CustomerReportDto[]>('/reports/customer', {
    params: { startDate, endDate },
  })
  return response.data
}
