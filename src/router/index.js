import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Departments from '../views/Departments.vue'
import Login from '../views/auth/Login.vue'
import BookAppointment from '@/views/BookAppointment.vue'
import Dashboard from "@/views/admin/Dashboard.vue";
import Appointments from "@/views/admin/Appointments.vue";
import Staff from "@/views/admin/Staff.vue";
import DashboardPatients from "@/views/DashboardPatients.vue";
import DashboardSettings from "@/views/DashboardSettings.vue";
import AdminDepartments from "@/views/admin/AdminDepartments.vue";
import DoctorDashboard from "@/views/doctor/Dashboard.vue";
import DoctorAppointments from "@/views/doctor/Appointments.vue";
import DoctorSchedule from "@/views/doctor/Schedule.vue";
import DashboardServices from '@/views/admin/DashboardServices.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/departments',
    name: 'departments',
    component: AdminDepartments
  },
  {
   path: '/dashboard/services',
    name: 'dashboard-services',
    component: DashboardServices
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
    component: Dashboard,
    // meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/appointments',
    name: 'dashboard-appointments',
    component: Appointments,
    // meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/departments',
    name: 'dashboard-departments',
    component: AdminDepartments,
    // meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/patients',
    name: 'dashboard-patients',
    component: DashboardPatients,
    // meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/staff',
    name: 'dashboard-staff',
    component: Staff,
    // meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/settings',
    name: 'dashboard-settings',
    component: DashboardSettings,
    // meta: { requiresAuth: true, role: 'admin' }
  },
  // Doctor routes
  {
    path: '/doctor/dashboard',
    name: 'doctor-dashboard',
    component: DoctorDashboard,
    // meta: { requiresAuth: true, role: 'doctor' }
  },
  {
    path: '/doctor/appointments',
    name: 'doctor-appointments',
    component: DoctorAppointments,
    // meta: { requiresAuth: true, role: 'doctor' }
  },
  {
    path: '/doctor/schedule',
    name: 'doctor-schedule',
    component: DoctorSchedule,
    // meta: { requiresAuth: true, role: 'doctor' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for role-based redirection
router.beforeEach((to, from, next) => {
  const user = getUserFromStorage()

  if (to.meta.requiresAuth && !user) {
    next('/login')
    return
  }

  if (user && user.role === 'doctor' && to.path.startsWith('/dashboard') && !to.path.startsWith('/doctor')) {
    next('/doctor/dashboard')
    return
  }

  if (user && user.role !== 'doctor' && to.path.startsWith('/doctor')) {
    next('/dashboard')
    return
  }

  next()
})

function getUserFromStorage() {
  try {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export default router