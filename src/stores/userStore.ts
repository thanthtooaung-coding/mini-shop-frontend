// src/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserResponseDto } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<Omit<UserResponseDto, 'role'> | null>(null)

  function setUser(user: Omit<UserResponseDto, 'role'> | null) {
    currentUser.value = user
  }

  function clearUser() {
    currentUser.value = null
  }

  return { currentUser, setUser, clearUser }
})
