// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    // meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/appointments',
    name: 'DashboardAppointments',
    component: () => import('@/views/DashboardAppointments.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/staff',
    name: 'DashboardStaff',
    component: () => import('@/views/DashboardStaff.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/patients',
    name: 'DashboardPatients',
    component: () => import('@/views/DashboardPatients.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/settings',
    name: 'DashboardSettings',
    component: () => import('@/views/DashboardSettings.vue'),
    // meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // Verify token is still valid
    const isValid = await authStore.fetchUser()
    if (!isValid) {
      return next('/login')
    }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router