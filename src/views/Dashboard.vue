<template>
  <AuthenticatedLayout page-title="Dashboard Overview">
    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Appointments</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalAppointments }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.pending }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Confirmed</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.confirmed }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.completed }}</p>
            </div>
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Appointments -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Recent Appointments</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr v-for="appointment in recentAppointments" :key="appointment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ appointment.patient_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ appointment.phone_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Service {{ appointment.service_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ appointment.status }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-indigo-600 hover:text-indigo-900">View</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AuthenticatedLayout from '@/components/AuthenticatedLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const stats = ref({
  totalAppointments: 0,
  pending: 0,
  confirmed: 0,
  completed: 0
})

const recentAppointments = ref([])

const fetchDashboardData = async () => {
  try {
    const response = await fetch('/api/appointments', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const appointments = await response.json()
      recentAppointments.value = appointments.slice(0, 5)

      // Calculate stats
      stats.value = {
        totalAppointments: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>