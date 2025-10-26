import apiClient from './api'
import type { ProductDto } from '@/types/api'

export const getAllProducts = async (): Promise<ProductDto[]> => {
  const response = await apiClient.get<ProductDto[]>('/products')
  return response.data
}

export const getProductById = async (id: number): Promise<ProductDto> => {
  const response = await apiClient.get<ProductDto>(`/products/${id}`)
  return response.data
}

export const createProduct = async (productData: ProductDto): Promise<ProductDto> => {
  const { id, ...data } = productData
  const response = await apiClient.post<ProductDto>('/products', data)
  return response.data
}

export const updateProduct = async (id: number, productData: ProductDto): Promise<ProductDto> => {
  const { id: bodyId, ...data } = productData
  const response = await apiClient.put<ProductDto>(`/products/${id}`, data)
  return response.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`)
}
