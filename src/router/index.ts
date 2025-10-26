import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/app/products',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/auth/RegisterView.vue'),
    },
    {
      path: '/app',
      component: () => import('@/pages/PageLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: 'products',
        },
        {
          path: 'products',
          name: 'ProductList',
          component: () => import('@/pages/products/ProductListView.vue'),
        },
        {
          path: 'products/new',
          name: 'ProductCreate',
          component: () => import('@/pages/products/ProductFormView.vue'),
        },
        {
          path: 'products/edit/:id',
          name: 'ProductEdit',
          component: () => import('@/pages/products/ProductFormView.vue'),
          props: true,
        },
        {
          path: 'products/:id',
          name: 'ProductDetail',
          component: () => import('@/pages/products/ProductFormView.vue'),
          props: true,
        },
        {
          path: 'categories',
          name: 'CategoryList',
          component: {
            template: '<div class="p-4"><h1>Categories Page (Coming Soon)</h1></div>',
          },
        },
        {
          path: 'sales',
          name: 'SalesList',
          component: {
            template: '<div class="p-4"><h1>Sales Page (Coming Soon)</h1></div>',
          },
        },
        {
          path: 'reports',
          name: 'Reports',
          component: {
            template: '<div class="p-4"><h1>Reports Page (Coming Soon)</h1></div>',
          },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next({ path: '/app' })
  } else {
    next()
  }
})

export default router
