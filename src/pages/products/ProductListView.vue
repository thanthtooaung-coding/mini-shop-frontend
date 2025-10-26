<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import DataTable from '@/components/DataTable.vue'
import { getAllProducts } from '@/services/productService'
import { getAllCategories } from '@/services/categoryService'
import type { ProductDto, CategoryDto } from '@/types/api'
import { createColumns } from './ProductColumns'
import { getRoutePath } from '@/utils/route'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { SortingState } from '@tanstack/vue-table'

const router = useRouter()

const currentPage = ref(1)
const rowsPerPage = ref(10)
const searchTerm = ref('')
const sorting = ref<SortingState>([])

const {
  data: productsResponse,
  isLoading: isLoadingProducts,
  isError: isErrorProducts,
  error: productsError,
} = useQuery<ProductDto[], Error>({
  queryKey: ['products'],
  queryFn: getAllProducts,
})

const {
  data: categories,
  isLoading: isLoadingCategories,
  isError: isErrorCategories,
  error: categoriesError,
} = useQuery<CategoryDto[], Error>({
  queryKey: ['categories'],
  queryFn: getAllCategories,
})

const productColumns = computed(() => createColumns(categories.value || []))

const sortedAndFilteredData = computed(() => {
  if (!productsResponse.value) return []

  // 1. Filter
  const lowerSearch = searchTerm.value.toLowerCase()
  let filtered = productsResponse.value.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearch) ||
      product.sku.toLowerCase().includes(lowerSearch),
  )

  // 2. Sort
  if (sorting.value.length > 0) {
    const sortKey = sorting.value[0].id as keyof ProductDto
    const sortDesc = sorting.value[0].desc
    filtered = [...filtered].sort((a, b) => {
      const valA = a[sortKey]
      const valB = b[sortKey]
      if (valA === undefined || valA === null) return sortDesc ? 1 : -1
      if (valB === undefined || valB === null) return sortDesc ? -1 : 1
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDesc ? valB - valA : valA - valB
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB)
      }
      return 0
    })
  }

  return filtered
})

const paginatedData = computed(() => {
  const data = sortedAndFilteredData.value
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return {
    items: data.slice(start, end),
    total: data.length,
  }
})

function handlePageChange(newPage: number) {
  currentPage.value = newPage
}
function handleRowsPerPageChange(newSize: number) {
  rowsPerPage.value = newSize
  currentPage.value = 1
}

function navigateToDetailsView(row: ProductDto) {
  router.push(`/app/products/${row.id}`)
}
</script>

<template>
  <div>
    <Header
      headerName="Products"
      buttonName="New Product"
      :route-path="getRoutePath()"
      :show-button="false"
    />
    <div class="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-foreground mb-4">Products</h1>

      <div v-if="isLoadingProducts || isLoadingCategories">Loading data...</div>
      <div v-else-if="isErrorProducts">Error loading products: {{ productsError?.message }}</div>
      <div v-else-if="isErrorCategories">
        Error loading categories: {{ categoriesError?.message }}
      </div>
      <DataTable
        v-else
        :columns="productColumns"
        :data="paginatedData.items"
        :total="paginatedData.total"
        :current-page="currentPage"
        :rowsPerPage="rowsPerPage"
        v-model:sorting="sorting"
        @page-changed="handlePageChange"
        @page-size-changed="handleRowsPerPageChange"
        @row-click="navigateToDetailsView"
      >
        <div class="flex items-center justify-between py-4">
          <Input v-model="searchTerm" placeholder="Search products..." class="max-w-sm h-9" />
          <Button @click="router.push('/app/products/new')"> New Product </Button>
        </div>
      </DataTable>
    </div>
  </div>
</template>
