<script setup lang="ts" generic="TData, TValue">
import { computed, defineEmits, defineProps, type PropType } from 'vue'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel, // <-- ADD THIS
  useVueTable,
} from '@tanstack/vue-table'

import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationContent,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  currentPage: number
  rowsPerPage: number
  sorting?: SortingState
}>()

const emits = defineEmits<{
  (e: 'page-changed', page: number): void
  (e: 'page-size-changed', size: number): void
  (e: 'row-click', row: TData): void
  (e: 'update:sorting', value: SortingState): void
}>()

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  manualPagination: true,
  state: {
    get sorting() {
      return props.sorting ?? []
    },
  },
  onSortingChange: (updater) => {
    const newSorting = typeof updater === 'function' ? updater(props.sorting ?? []) : updater
    emits('update:sorting', newSorting)
  },
})

const totalPages = computed(() => {
  return Math.ceil(props.total / props.rowsPerPage)
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emits('page-changed', page)
  }
}

const handlePageSizeChange = (size: string) => {
  emits('page-size-changed', Number(size))
}

const handleRowClick = (row: TData) => {
  emits('row-click', row)
}

const paginationItems = computed(() => {
  const items: (number | '...')[] = []
  const maxPagesToShow = 5
  const startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2))
  const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

  if (startPage > 1) {
    items.push(1)
    if (startPage > 2) {
      items.push('...')
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    items.push(i)
  }

  if (endPage < totalPages.value) {
    if (endPage < totalPages.value - 1) {
      items.push('...')
    }
    items.push(totalPages.value)
  }

  return items
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <slot />
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="header.id === 'actions' ? 'w-[80px]' : ''"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
              class="cursor-pointer"
              @click="handleRowClick(row.original)"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableEmpty :colspan="columns.length"> No results found. </TableEmpty>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="totalPages > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">Rows per page</span>
        <Select :model-value="String(rowsPerPage)" @update:model-value="handlePageSizeChange">
          <SelectTrigger class="w-20 h-9">
            <SelectValue :placeholder="rowsPerPage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="size in [10, 20, 50]" :key="size" :value="String(size)">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="text-sm text-muted-foreground">
        Page {{ currentPage }} of {{ totalPages }} ({{ total }} total rows)
      </div>

      <Pagination
        :total="total"
        :page="currentPage"
        :items-per-page="rowsPerPage"
        :sibling-count="1"
        @update:page="handlePageChange"
        show-edges
      >
        <PaginationContent>
          <PaginationFirst @click="handlePageChange(1)" />
          <PaginationPrevious @click="handlePageChange(Math.max(1, currentPage - 1))" />

          <template v-for="(item, index) in paginationItems" :key="index">
            <PaginationItem
              v-if="typeof item === 'number'"
              :value="item"
              :is-active="item === currentPage"
              @click="handlePageChange(item)"
            >
              {{ item }}
            </PaginationItem>
            <PaginationEllipsis v-else />
          </template>

          <PaginationNext @click="handlePageChange(Math.min(totalPages, currentPage + 1))" />
          <PaginationLast @click="handlePageChange(totalPages)" />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
