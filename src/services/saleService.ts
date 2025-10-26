import apiClient from './api'
import type { SaleRequestDto, SaleResponseDto } from '@/types/api'

export const getAllSales = async (): Promise<SaleResponseDto[]> => {
  const response = await apiClient.get<SaleResponseDto[]>('/sales')
  return response.data
}

export const getSaleById = async (id: number): Promise<SaleResponseDto> => {
  const response = await apiClient.get<SaleResponseDto>(`/sales/${id}`)
  return response.data
}

export const createSale = async (saleData: SaleRequestDto): Promise<SaleResponseDto> => {
  const response = await apiClient.post<SaleResponseDto>('/sales', saleData)
  return response.data
}
