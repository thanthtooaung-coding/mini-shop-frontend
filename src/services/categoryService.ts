import apiClient from './api'
import type { CategoryDto } from '@/types/api'

export const getAllCategories = async (): Promise<CategoryDto[]> => {
  const response = await apiClient.get<CategoryDto[]>('/categories')
  return response.data
}

export const getCategoryById = async (id: number): Promise<CategoryDto> => {
  const response = await apiClient.get<CategoryDto>(`/categories/${id}`)
  return response.data
}

export const createCategory = async (categoryData: CategoryDto): Promise<CategoryDto> => {
  const { id, ...data } = categoryData
  const response = await apiClient.post<CategoryDto>('/categories', data)
  return response.data
}

export const updateCategory = async (
  id: number,
  categoryData: CategoryDto,
): Promise<CategoryDto> => {
  const { id: bodyId, ...data } = categoryData
  const response = await apiClient.put<CategoryDto>(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: number, hardDelete = false): Promise<void> => {
  await apiClient.delete(`/categories/${id}`, { params: { hardDelete } })
}
