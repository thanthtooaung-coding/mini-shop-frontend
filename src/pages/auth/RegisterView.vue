<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { register as apiRegister } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import { Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const { toast } = useToast()
const error = ref<string | null>(null)

const roles = ['OWNER', 'ADMIN', 'CASHIER'] as const

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(40),
    role: z.enum(roles),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
    email: '',
    password: '',
    role: 'CASHIER',
  },
})

const onSubmit = handleSubmit(async (values) => {
  error.value = null
  try {
    const response = await apiRegister(values)
    authStore.setAuthData(response)

    toast({
      title: 'Registration Successful',
      description: 'Account created. Please log in.',
    })
    router.push({ name: 'Login' })
  } catch (err: any) {
    console.error('Registration failed:', err)
    error.value = err.response?.data?.message || err.message || 'Registration failed'
    toast({
      title: 'Registration Failed',
      description: error.value ?? undefined,
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Register</CardTitle>
        <CardDescription class="text-center"> Create your account </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="your_username" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="role">
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="roleOption in roles" :key="roleOption" :value="roleOption">
                      {{ roleOption }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <div v-if="error" class="text-sm font-medium text-destructive">
            {{ error }}
          </div>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            Register
          </Button>

          <div class="text-center text-sm">
            Already have an account?
            <RouterLink :to="{ name: 'Login' }" class="underline"> Login </RouterLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
