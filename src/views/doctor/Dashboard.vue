<template>
  <DoctorLayout page-title="Doctor Dashboard">
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Welcome back, Dr. {{ user?.first_name }} {{ user?.last_name }}
        </h2>
        <p class="mt-1 text-gray-600">
          Here's what's happening in your practice today
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayStats.appointments }}</p>
            </div>
          </div>
        </div>

        <!-- <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Patients</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayStats.totalPatients }}</p>
            </div>
          </div>
        </div> -->

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayStats.pending }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayStats.completed }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Today's Schedule</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="appointment in todayAppointments" :key="appointment.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-white">
                      {{ appointment.patient_name.charAt(0) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ appointment.patient_name }}</p>
                    <p class="text-sm text-gray-500">{{ appointment.service_name }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ formatTime(appointment.appointment_time) }}</p>
                  <span :class="getStatusClasses(appointment.status)">
                    {{ formatStatus(appointment.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Patients -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Recent Appointments</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="patient in recentPatients" :key="patient.id" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ patient.name.charAt(0) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ patient.name }}</p>
                    <p class="text-sm text-gray-500">Last visit: {{ formatDate(patient.last_visit) }}</p>
                  </div>
                </div>
                <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View Records
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DoctorLayout from '@/components/DoctorLayout.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/plugins/axios'

const authStore = useAuthStore()
const user = computed(() => authStore.user)


const todayStats = ref({
  appointments: 0,
  totalPatients: 0,
  pending: 0,
  completed: 0
})

const todayAppointments = ref([])
const recentPatients = ref([])


// Fetch dashboard data
const fetchDashboard = async () => {
  try {
    const response = await api.get('/dashboard/summary')
    const data = response.data

    todayStats.value = data.todayStats
    todayAppointments.value = data.todayAppointments
    recentPatients.value = data.recentPatients
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

// Methods
const getStatusClasses = (status) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'

  switch (status) {
    case 'confirmed':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'completed':
      return `${baseClasses} bg-blue-100 text-blue-800`
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  fetchDashboard()
})
</script>