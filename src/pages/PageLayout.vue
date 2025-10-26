<script lang="ts"></script>
<script setup lang="ts">
import { ref, provide } from 'vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
const sidebarWidth = ref(256) // 64rem = 256px
provide('sidebarWidth', sidebarWidth)
</script>
<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
