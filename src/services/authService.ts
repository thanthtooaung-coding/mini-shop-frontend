import apiClient from './api'
import type { LoginRequest, RegisterRequest, JwtAuthResponse } from '@/types/api'

export const register = async (registerData: RegisterRequest): Promise<JwtAuthResponse> => {
  const response = await apiClient.post<JwtAuthResponse>('/auth/register', registerData)
  return response.data
}

export const login = async (loginData: LoginRequest): Promise<JwtAuthResponse> => {
  const response = await apiClient.post<JwtAuthResponse>('/auth/login', loginData)
  return response.data
}
