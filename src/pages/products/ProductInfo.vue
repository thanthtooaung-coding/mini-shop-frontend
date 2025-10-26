<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import type { ProductDto, CategoryDto } from '@/types/api' //
import { getAllCategories } from '@/services/categoryService' //
import { Button } from '@/components/ui/button' //
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card' //
import InfoItem from '@/components/InfoItem.vue' //
import { Separator } from '@/components/ui/separator' //
import { useQuery } from '@tanstack/vue-query'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  productData: ProductDto | null
  isLoading?: boolean
  isError?: boolean
}>()

const emit = defineEmits<{
  edit: []
  delete: []
  cancel: []
}>()

const { data: categories, isLoading: isLoadingCategories } = useQuery<CategoryDto[], Error>({
  queryKey: ['categories'],
  queryFn: getAllCategories, //
})

const categoryName = computed(() => {
  if (isLoadingCategories.value || !categories.value || !props.productData) {
    return 'Loading...'
  }
  const category = categories.value.find((cat) => cat.id === props.productData?.categoryId)
  return category ? category.name : 'Unknown Category'
})

const formattedSellingPrice = computed(() => {
  if (!props.productData) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MMK' }).format(
    props.productData.sellingPrice,
  )
})

const formattedCostPrice = computed(() => {
  if (!props.productData) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MMK' }).format(
    props.productData.costPrice,
  )
})
</script>

<template>
  <Card class="w-full max-w-2xl">
    <CardHeader>
      <div v-if="isLoading" class="flex items-center justify-center h-40">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>
      <div v-else-if="isError" class="text-destructive">Error loading product details.</div>
      <template v-else-if="productData">
        <CardTitle>{{ productData.name }}</CardTitle>
        <CardDescription>SKU: {{ productData.sku }}</CardDescription>
      </template>
      <div v-else class="text-muted-foreground">Product not found.</div>
    </CardHeader>

    <CardContent v-if="!isLoading && !isError && productData" class="space-y-6">
      <InfoItem label="Description" :value="productData.description || '-'" />
      <Separator />
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <InfoItem label="Selling Price" :value="formattedSellingPrice" />
        <InfoItem label="Cost Price" :value="formattedCostPrice" />
        <InfoItem label="Quantity" :value="productData.quantity" />
        <InfoItem label="Category" :value="categoryName" />
      </div>
    </CardContent>

    <CardFooter class="flex justify-end gap-2">
      <Button variant="outline" @click="emit('cancel')" :disabled="isLoading"> Back </Button>
      <Button variant="secondary" @click="emit('edit')" :disabled="isLoading || !productData">
        Edit
      </Button>
      <Button variant="destructive" @click="emit('delete')" :disabled="isLoading || !productData">
        Delete
      </Button>
    </CardFooter>
  </Card>
</template>
