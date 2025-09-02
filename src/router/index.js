import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Departments from '../views/Departments.vue'
import Login from '../views/auth/Login.vue'
import BookAppointment from '@/views/BookAppointment.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/departments',
    name: 'departments',
    component: Departments
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/book-appointment',
    name: 'book-appointment',
    component: BookAppointment
  },
   {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router