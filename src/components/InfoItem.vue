<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<template>
  <div>
    <div class="text-sm font-medium text-muted-foreground">{{ label }}</div>
    <div class="text-lg font-semibold">{{ value }}</div>
  </div>
</template>
