import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Departments from '../views/Departments.vue'
import About from '../views/About.vue'
import Map from '../views/Map.vue'
import BookAmbulance from '@/views/BookAmbulance.vue'
import Login from '../views/auth/Login.vue'
import BookAppointment from '@/views/BookAppointment.vue'
import Dashboard from "@/views/admin/Dashboard.vue";
import Appointments from "@/views/helpdesk/Appointments.vue";
import Staff from "@/views/admin/Staff.vue";
import DashboardPatients from "@/views/DashboardPatients.vue";
import DashboardSettings from "@/views/DashboardSettings.vue";
import AdminDepartments from "@/views/admin/AdminDepartments.vue";
import DoctorDashboard from "@/views/doctor/Dashboard.vue";
import HelpDeskDashboard from "@/views/helpdesk/Dashboard.vue";
import DoctorAppointments from "@/views/doctor/Appointments.vue";
import DoctorSchedule from "@/views/doctor/Schedule.vue";
import DashboardServices from '@/views/admin/DashboardServices.vue'
import { useAuthStore } from '@/stores/auth'
import HelpDeskProfile from '@/views/helpdesk/Profile.vue'
import HelpDeskAppointments from '@/views/helpdesk/Appointments.vue'

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
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/appointments',
    name: 'dashboard-appointments',
    component: Appointments,
    meta: { requiresAuth: true, role: 'help desk' }
  },
  {
    path: '/dashboard/departments',
    name: 'dashboard-departments',
    component: AdminDepartments,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/patients',
    name: 'dashboard-patients',
    component: DashboardPatients,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/staff',
    name: 'dashboard-staff',
    component: Staff,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/settings',
    name: 'dashboard-settings',
    component: DashboardSettings,
    meta: { requiresAuth: true, role: 'admin' }
  },

  // Doctor routes
  {
    path: '/doctor/dashboard',
    name: 'doctor-dashboard',
    component: DoctorDashboard,
    meta: { requiresAuth: true, role: 'doctor' }
  },
  {
    path: '/doctor/appointments',
    name: 'doctor-appointments',
    component: DoctorAppointments,
    meta: { requiresAuth: true, role: 'doctor' }
  },
  {
    path: '/doctor/schedule',
    name: 'doctor-schedule',
    component: DoctorSchedule,
    meta: { requiresAuth: true, role: 'doctor' }
  }
  , {
    path: '/helpdesk/profile',
    name: 'helpdesk-profile',
    component: HelpDeskProfile,
    meta: { requiresAuth: true, role: 'helpdesk' }
  }, {
    path: '/helpdesk/appointments',
    name: 'helpdesk-appointments',
    component: HelpDeskAppointments,
    meta: { requiresAuth: true, role: 'helpdesk' }
  }

   , {
    path: '/helpdesk/dashboard',
    name: 'helpdesk-dashboard',
    component: HelpDeskDashboard,
    meta: { requiresAuth: true, role: 'helpdesk' }
  }, {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/map',
    name: 'map',
    component: Map
  },
  {
    path: '/book-ambulance',
    name: 'book-ambulance',
    component: BookAmbulance
  },
    // meta: { requiresAuth: true, role: 'helpdesk' }
  // }


  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// helper: redirect by role
const roleRedirects = {
  admin: '/dashboard',
  doctor: '/doctor/dashboard',
  helpdesk: '/helpdesk/dashboard',
}

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.user && localStorage.getItem('user')) {
    authStore.initializeAuth()
  }

  const user = authStore.user

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if (user) {
    const redirectPath = roleRedirects[user.role] || '/'

    if (to.path === '/login') {
      return next(redirectPath)
    }

    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      return next(redirectPath)
    }
  }

  next()
})

export default router