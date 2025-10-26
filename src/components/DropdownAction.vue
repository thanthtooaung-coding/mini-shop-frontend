<script setup lang="ts">
import { ref, defineProps, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Define the ActionItem type that is expected by ProductColumns.ts
export interface ActionItem {
  icon: Component
  label: string
  visible: boolean
  to?: string
  onClick?: () => void
  deleteDialog?: {
    itemName: string
    title: string
    description: string
    onDelete: () => void
  }
}

defineProps<{
  actions: ActionItem[]
}>()

const isDeleteDialogOpen = ref(false)
const selectedAction = ref<ActionItem | null>(null)

const openDeleteDialog = (action: ActionItem) => {
  selectedAction.value = action
  isDeleteDialogOpen.value = true
}

const confirmDelete = () => {
  if (selectedAction.value && selectedAction.value.deleteDialog) {
    selectedAction.value.deleteDialog.onDelete()
  }
  isDeleteDialogOpen.value = false
}
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon-sm">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <template v-for="(action, index) in actions.filter((a) => a.visible)" :key="index">
          <DropdownMenuItem v-if="action.to" as-child>
            <RouterLink :to="action.to" class="flex items-center gap-2 cursor-pointer">
              <component :is="action.icon" />
              <span>{{ action.label }}</span>
            </RouterLink>
          </DropdownMenuItem>

          <DropdownMenuItem
            v-else-if="action.deleteDialog"
            class="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            @click.prevent="openDeleteDialog(action)"
          >
            <component :is="action.icon" />
            <span>{{ action.label }}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            v-else-if="action.onClick"
            class="flex items-center gap-2 cursor-pointer"
            @click="action.onClick"
          >
            <component :is="action.icon" />
            <span>{{ action.label }}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator
            v-if="action.label === 'Edit' && actions.some((a) => a.deleteDialog?.visible)"
          />
        </template>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {{ selectedAction?.deleteDialog?.title || 'Are you sure?' }}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {{ selectedAction?.deleteDialog?.description || 'This action cannot be undone.' }}
            <br />
            <strong class="font-medium">{{ selectedAction?.deleteDialog?.itemName }}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="isDeleteDialogOpen = false"> Cancel </AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete"> Delete </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
