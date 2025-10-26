<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/services/productService' //
import type { ProductDto } from '@/types/api' //
import Header from '@/components/Header.vue' //
import ProductForm from './ProductForm.vue'
import ProductInfo from './ProductInfo.vue'
import { useToast } from '@/components/ui/toast' //
import { getRoutePath } from '@/utils/route' //
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog' //

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const { toast } = useToast()

const isDeleteDialogOpen = ref(false)

const isCreate = computed(() => route.path.endsWith('/new'))
const isEdit = computed(() => route.path.includes('/edit/'))
const isView = computed(() => !isCreate.value && !isEdit.value)

const productId = computed(() => {
  const idParam = route.params.id
  if (idParam && typeof idParam === 'string' && !isNaN(Number(idParam))) {
    return Number(idParam)
  }
  return undefined
})

const headerTitle = computed(() => {
  if (isCreate.value) return 'Create Product'
  if (isEdit.value) return `Edit Product`
  if (isView.value) return `Product Details`
  return 'Product'
})

const {
  data: productData,
  isLoading: isLoadingProduct,
  isError: isErrorProduct,
  error: productError,
  refetch,
} = useQuery<ProductDto, Error>({
  queryKey: ['product', productId],
  queryFn: async () => {
    if (productId.value === undefined) {
      throw new Error('Product ID is missing')
    }
    return getProductById(productId.value) //
  },
  enabled: computed(() => (isEdit.value || isView.value) && productId.value !== undefined),
  retry: false,
})

const dynamicHeaderName = computed(() => {
  if ((isEdit.value || isView.value) && productData.value) {
    return `${isEdit.value ? 'Edit' : ''} ${productData.value.name}`
  }
  return headerTitle.value
})

const createMutation = useMutation({
  mutationFn: createProduct, //
  onSuccess: (newProduct) => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    toast({ title: 'Success', description: 'Product created successfully.' }) //
    router.push(`/app/products/${newProduct.id}`)
  },
  onError: (error: any) => {
    toast({
      //
      title: 'Error',
      description: error.message || 'Failed to create product.',
      variant: 'destructive',
    })
  },
})

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: ProductDto }) => updateProduct(id, data), //
  onSuccess: (updatedProduct) => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] })
    toast({ title: 'Success', description: 'Product updated successfully.' }) //
    router.push(`/app/products/${updatedProduct.id}`)
  },
  onError: (error: any) => {
    toast({
      //
      title: 'Error',
      description: error.message || 'Failed to update product.',
      variant: 'destructive',
    })
  },
})

const deleteMutation = useMutation({
  mutationFn: deleteProduct, //
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    if (productId.value) {
      queryClient.removeQueries({ queryKey: ['product', productId.value] })
    }
    toast({ title: 'Success', description: 'Product deleted successfully.' }) //
    router.push('/app/products')
  },
  onError: (error: any) => {
    toast({
      //
      title: 'Error',
      description: error.message || 'Failed to delete product.',
      variant: 'destructive',
    })
  },
})

const handleCreateSubmit = (values: ProductDto) => {
  createMutation.mutate(values)
}

const handleUpdateSubmit = (values: ProductDto) => {
  if (productId.value === undefined) {
    toast({ title: 'Error', description: 'Product ID is missing.', variant: 'destructive' }) //
    return
  }
  updateMutation.mutate({ id: productId.value, data: values })
}

const handleCancel = () => {
  if (isEdit.value && productId.value !== undefined) {
    router.push(`/app/products/${productId.value}`)
  } else {
    router.push('/app/products')
  }
}

const switchToEditMode = () => {
  if (productId.value !== undefined) {
    router.push(`/app/products/edit/${productId.value}`)
  }
}

const openDeleteDialog = () => {
  isDeleteDialogOpen.value = true
}

const confirmDelete = () => {
  if (productId.value !== undefined) {
    deleteMutation.mutate(productId.value)
  }
  isDeleteDialogOpen.value = false
}

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId && (isEdit.value || isView.value) && newId) {
      refetch()
    }
  },
)

const getHeaderRoutePath = () => {
  const path = getRoutePath() //
  if (!path) return ['app', 'products']
  if (isEdit.value || isView.value) {
    return path.slice(0, -1)
  }
  return path
}
</script>

<template>
  <div>
    <Header
      :headerName="dynamicHeaderName"
      :route-path="getHeaderRoutePath()"
      :show-button="false"
    />
    <div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="isLoadingProduct && (isEdit || isView)">Loading product data...</div>
      <div v-else-if="isErrorProduct && (isEdit || isView)">
        Error loading product: {{ productError?.message }}
      </div>

      <ProductForm
        v-else-if="isCreate || isEdit"
        :product-data="isEdit ? productData || null : null"
        :is-submitting="createMutation.isPending.value || updateMutation.isPending.value"
        @submit="isCreate ? handleCreateSubmit($event) : handleUpdateSubmit($event)"
        @cancel="handleCancel"
      />

      <ProductInfo
        v-else-if="isView"
        :product-data="productData || null"
        :is-loading="isLoadingProduct"
        :is-error="isErrorProduct"
        @edit="switchToEditMode"
        @delete="openDeleteDialog"
        @cancel="handleCancel"
      />

      <div v-else>Invalid state or product ID.</div>
    </div>

    <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product
            <strong>{{ productData?.name }}</strong
            >.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="isDeleteDialogOpen = false"> Cancel </AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete" class="bg-destructive hover:bg-destructive/90">
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
