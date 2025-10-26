<template>
  <div class="min-h-screen bg-background text-foreground">
    <RouterView />

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>
