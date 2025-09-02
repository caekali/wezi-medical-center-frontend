import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Departments from '../views/Departments.vue'
import Login from '../views/auth/Login.vue'
import BookAppointment from '@/views/BookAppointment.vue'
import Dashboard from "@/views/Dashboard.vue";
import DashboardAppointments from "@/views/DashboardAppointments.vue";
import DashboardStaff from "@/views/DashboardStaff.vue";
import DashboardPatients from "@/views/DashboardPatients.vue";
import DashboardSettings from "@/views/DashboardSettings.vue";

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
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/dashboard/appointments',
    name: 'dashboard-appointments',
    component: DashboardAppointments
  },
  {
    path: '/dashboard/patients',
    name: 'dashboard-patients',
    component: DashboardPatients
  },
  {
    path: '/dashboard/staff',
    name: 'dashboard-staff',
    component: DashboardStaff
  },
  {
    path: '/dashboard/settings',
    name: 'dashboard-settings',
    component: DashboardSettings
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router