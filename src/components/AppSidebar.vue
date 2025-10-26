<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarNav,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Package, Home, BarChart2, ShoppingCart, LogOut, Tags } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const username = computed(() => authStore.username)

const navItems = [
  { name: 'Products', href: '/app/products', icon: Package },
  { name: 'Categories', href: '/app/categories', icon: Tags },
  { name: 'Sales', href: '/app/sales', icon: ShoppingCart },
  { name: 'Reports', href: '/app/reports', icon: BarChart2 },
]

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex items-center gap-2">
        <Home class="h-6 w-6 text-primary" />
        <span class="font-semibold text-lg">Shop Mgt</span>
      </div>
    </SidebarHeader>

    <SidebarBody>
      <SidebarNav>
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            :class="[
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </a>
        </RouterLink>
      </SidebarNav>
    </SidebarBody>

    <SidebarFooter>
      <div class="flex flex-col items-start gap-2">
        <span class="text-sm font-medium">Logged in as:</span>
        <span class="font-semibold">{{ username }}</span>
        <Button variant="outline" size="sm" class="w-full" @click="handleLogout">
          <LogOut class="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>
