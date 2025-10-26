<script setup lang="ts">
import { computed, defineEmits, defineProps, watch, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form' //
import { Input } from '@/components/ui/input' //
import { Textarea } from '@/components/ui/textarea' //
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' //
import { Loader2 } from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{
  productData?: ProductDto | null
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [values: ProductDto]
  cancel: []
}>()

const {
  data: categories,
  isLoading: isLoadingCategories,
  isError: isErrorCategories,
} = useQuery<CategoryDto[], Error>({
  queryKey: ['categories'],
  queryFn: getAllCategories, //
})

const formSchema = toTypedSchema(
  z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Name is required'),
    sku: z.string().min(1, 'SKU is required'),
    description: z.string().optional(),
    costPrice: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Cost price cannot be negative'),
    sellingPrice: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Selling price cannot be negative'),
    quantity: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .int('Quantity must be a whole number')
      .min(0, 'Quantity cannot be negative'),
    categoryId: z.coerce.number({
      required_error: 'Category is required',
      invalid_type_error: 'Category is required',
    }),
  }),
)

// --- Form Setup ---
const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: props.productData || {},
})

const isEditMode = computed(() => !!props.productData?.id)

watch(
  () => props.productData,
  (newData) => {
    resetForm({ values: newData || {} })
  },
  { deep: true, immediate: true },
)

const submitHandler = handleSubmit((values) => {
  const numericValues = {
    ...values,
    costPrice: Number(values.costPrice),
    sellingPrice: Number(values.sellingPrice),
    quantity: Number(values.quantity),
    categoryId: Number(values.categoryId),
  }
  emit('submit', numericValues)
})

const cancelForm = () => {
  emit('cancel')
}
</script>

<template>
  <Card class="w-full max-w-2xl">
    <CardHeader>
      <CardTitle>{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</CardTitle>
      <CardDescription>
        {{
          isEditMode ? 'Update the product details.' : 'Fill in the details for the new product.'
        }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="submitHandler" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., T-Shirt" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="sku">
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., TSHIRT-RED-L" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Product details..." v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField v-slot="{ componentField }" name="costPrice">
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="sellingPrice">
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="quantity">
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="0" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="categoryId">
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger :disabled="isLoadingCategories">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <div v-if="isLoadingCategories" class="p-2 text-sm text-muted-foreground">
                  Loading categories...
                </div>
                <div v-else-if="isErrorCategories" class="p-2 text-sm text-destructive">
                  Error loading categories
                </div>
                <SelectGroup v-else>
                  <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id!">
                    {{ cat.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <CardFooter class="flex justify-end gap-2 px-0 pt-6">
          <Button type="button" variant="outline" @click="cancelForm" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            {{ isEditMode ? 'Update Product' : 'Create Product' }}
          </Button>
        </CardFooter>
      </form>
    </CardContent>
  </Card>
</template>
