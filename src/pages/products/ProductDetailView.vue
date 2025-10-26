<template>
  <div class="container mx-auto p-4">
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
      <span class="ml-2 text-lg">Loading product...</span>
    </div>

    <div v-else-if="error" class="text-center text-destructive">
      <h2 class="text-2xl font-bold mb-4">Error</h2>
      <p>{{ error.message }}</p>
      <Button @click="goBack" variant="outline" class="mt-4"> Go Back </Button>
    </div>

    <Card v-else-if="product" class="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle class="text-3xl">{{ product.name }}</CardTitle>
        <CardDescription>SKU: {{ product.sku }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="text-lg">
          {{ product.description || 'No description available.' }}
        </div>
        <Separator />
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-medium text-muted-foreground">Selling Price</div>
            <div class="text-2xl font-bold text-primary">
              ${{ product.sellingPrice.toFixed(2) }}
            </div>
          </div>
          <div>
            <div class="text-sm font-medium text-muted-foreground">Cost Price</div>
            <div class="text-lg">${{ product.costPrice.toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-muted-foreground">Quantity</div>
            <div class="text-lg">{{ product.quantity }} in stock</div>
          </div>
          <div>
            <div class="text-sm font-medium text-muted-foreground">Category ID</div>
            <div class="text-lg">{{ product.categoryId }}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button @click="goBack" variant="outline">Back to Products</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getProductById } from '@/services/productService'
import type { ProductDto } from '@/types/api'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { toast } = useToast()

const product = ref<ProductDto | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

const fetchProduct = async (productId: number) => {
  isLoading.value = true
  error.value = null
  product.value = null
  try {
    product.value = await getProductById(productId)
  } catch (err: any) {
    error.value = err
    toast({
      title: 'Error',
      description: `Failed to fetch product: ${err.message}`,
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const productId = Number(props.id)
  if (!isNaN(productId)) {
    fetchProduct(productId)
  } else {
    error.value = new Error('Invalid product ID.')
    isLoading.value = false
  }
})

watch(
  () => props.id,
  (newId) => {
    const productId = Number(newId)
    if (!isNaN(productId)) {
      fetchProduct(productId)
    }
  },
)

const goBack = () => {
  router.push({ name: 'ProductList' })
}
</script>
