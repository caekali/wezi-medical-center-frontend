import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Departments from '../views/Departments.vue'
import Login from '../views/Login.vue'
import BookAppointment from '@/views/BookAppointment.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router