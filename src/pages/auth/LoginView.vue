<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription class="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="your_username"
                  v-bind="componentField"
                  autocomplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div class="relative">
                  <Input
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    v-bind="componentField"
                    autocomplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute inset-y-0 right-0 h-full px-3"
                    @click="showPassword = !showPassword"
                    tabindex="-1"
                  >
                    <Eye v-if="!showPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div v-if="error" class="text-sm font-medium text-destructive">
            {{ error }}
          </div>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'

const authStore = useAuthStore()
const router = useRouter()
const { toast } = useToast()

const showPassword = ref(false)
const error = ref<string | null>(null)

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
    password: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  error.value = null
  try {
    await authStore.login(values)

    toast({
      title: 'Login Successful',
      description: `Welcome back, ${authStore.username}!`,
    })
    router.push('/app/products')
  } catch (err: any) {
    console.error('Login failed:', err)
    error.value = err.message || 'Invalid username or password'
    toast({
      title: 'Login Failed',
      description: error.value ?? undefined,
      variant: 'destructive',
    })
  }
})
</script>
