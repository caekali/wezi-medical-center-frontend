<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 border-b">
        <img src="../assets/logo.png" class="h-5" alt="">
        <h1 class="text-lg font-semibold text-gray-800">Doctor Portal</h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="[
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            $route.path === item.href
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Menu -->
      <div class="px-4 py-4 border-t">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">
                {{ user?.first_name?.charAt(0) || 'D' }}
              </span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700">Dr. {{ user?.first_name }} {{ user?.last_name }}</p>
            <p class="text-xs text-gray-500">{{ user?.department || 'Doctor' }}</p>
          </div>
        </div>
        <button
            @click="handleLogout"
            class="w-full mt-3 px-3 py-2 text-sm text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>

    <!-- Mobile sidebar backdrop -->
    <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 md:hidden"
        @click="sidebarOpen = false"
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <!-- Mobile sidebar -->
    <aside
        :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex items-center justify-between h-16 px-4 border-b">
        <h1 class="text-xl font-semibold text-gray-800">Doctor Portal</h1>
        <button @click="sidebarOpen = false" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            @click="sidebarOpen = false"
            :class="[
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            $route.path === item.href
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top bar -->
      <header class="bg-white shadow-sm border-b">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex items-center">
            <button
                @click="sidebarOpen = !sidebarOpen"
                class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Icons
const DashboardIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>`
}

const AppointmentsIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
}

const PatientsIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>`
}

const MedicalRecordsIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
}

const ScheduleIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}

const PrescriptionsIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>`
}

const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Doctor Dashboard'
  }
})

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const user = computed(() => authStore.user)

const navigationItems = [
  { name: 'Dashboard', href: '/doctor/dashboard', icon: DashboardIcon },
  { name: 'My Appointments', href: '/doctor/appointments', icon: AppointmentsIcon },
  { name: 'My Schedule', href: '/doctor/schedule', icon: ScheduleIcon },
  { name: 'Profile', href: '/doctor/profile', },
]

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>