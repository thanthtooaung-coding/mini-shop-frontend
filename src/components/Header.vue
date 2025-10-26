<script setup lang="ts">
import { defineProps } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    headerName: string
    buttonName?: string
    routePath?: string[]
    showButton?: boolean
  }>(),
  {
    buttonName: 'New',
    routePath: () => [],
    showButton: false,
  },
)

const router = useRouter()

const navigateTo = () => {
  if (props.routePath.length > 0) {
    const newPath = `/${props.routePath.join('/')}/new`
    router.push(newPath)
  }
}
</script>

<template>
  <header class="bg-card border-b border-border shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex flex-col">
          <nav v-if="routePath.length > 0" class="flex items-center text-sm font-medium">
            <template v-for="(path, index) in routePath" :key="path">
              <RouterLink
                :to="`/${routePath.slice(0, index + 1).join('/')}`"
                class="text-muted-foreground hover:text-primary capitalize"
                :class="{ 'text-primary': index === routePath.length - 1 }"
              >
                {{ path.replace('-', ' ') }}
              </RouterLink>
              <ChevronRightIcon
                v-if="index < routePath.length - 1"
                class="h-4 w-4 mx-1 text-muted-foreground"
              />
            </template>
          </nav>

          <h1 class="text-2xl font-semibold text-foreground"></h1>
        </div>

        <div v-if="showButton">
          <Button @click="navigateTo">
            {{ buttonName }}
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>
