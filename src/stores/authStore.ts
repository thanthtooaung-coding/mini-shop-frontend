import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginRequest, JwtAuthResponse } from '@/types/api'
import { login as apiLogin } from '@/services/authService'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const username = ref<string | null>(null)
    const role = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    const isAdmin = computed(() => role.value === 'ADMIN' || role.value === 'OWNER')
    const isOwner = computed(() => role.value === 'OWNER')

    function setAuthData(data: JwtAuthResponse) {
      token.value = data.token
      username.value = data.username
      role.value = data.role
    }

    function clearAuthData() {
      token.value = null
      username.value = null
      role.value = null
    }

    async function login(credentials: LoginRequest) {
      try {
        const response = await apiLogin(credentials)
        setAuthData(response)
      } catch (error) {
        clearAuthData()
        console.error('Login failed:', error)
        throw error
      }
    }

    function logout() {
      clearAuthData()
    }

    return {
      token,
      username,
      role,
      isAuthenticated,
      isAdmin,
      isOwner,
      login,
      logout,
      setAuthData,
    }
  },
  {
    persist: true,
  },
)
