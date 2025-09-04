<template>
  <AuthenticatedLayout page-title="Appointments Management">
    <div class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p class="mt-1 text-sm text-gray-500">Manage and track all patient appointments</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
                v-model="filters.search"
                type="text"
                placeholder="Patient name or phone..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
                v-model="filters.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
                v-model="filters.service"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Services</option>
              <option v-for="service in services" :key="service.id" :value="service.id">
                {{ service.name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button
                @click="clearFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Appointments Table -->
      <div class="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading appointments...
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredAppointments.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                No appointments found
              </td>
            </tr>
            <tr v-else v-for="appointment in paginatedAppointments" :key="appointment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ appointment.patient_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ appointment.phone_number }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ getServiceName(appointment.service_id) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(appointment.status)">
                    {{ appointment.status }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(appointment.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                      @click="viewAppointment(appointment)"
                      class="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  <button
                      @click="editAppointment(appointment)"
                      class="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button
                      @click="deleteAppointment(appointment)"
                      class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredAppointments.length) }} of {{ filteredAppointments.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ showCreateModal ? 'Create New Appointment' : 'Edit Appointment' }}
                </h3>

                <form @submit.prevent="saveAppointment" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <input
                        v-model="appointmentForm.patient_name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        v-model="appointmentForm.phone_number"
                        type="tel"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select
                        v-model="appointmentForm.service_id"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a service</option>
                      <option v-for="service in services" :key="service.id" :value="service.id">
                        {{ service.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        v-model="appointmentForm.status"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div class="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        @click="closeModal"
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {{ saving ? 'Saving...' : (showCreateModal ? 'Create' : 'Update') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showViewModal = false"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Appointment Details
                </h3>

                <div v-if="selectedAppointment" class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-500">Patient Name:</span>
                    <p class="text-sm text-gray-900">{{ selectedAppointment.patient_name }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Phone Number:</span>
                    <p class="text-sm text-gray-900">{{ selectedAppointment.phone_number }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Service:</span>
                    <p class="text-sm text-gray-900">{{ getServiceName(selectedAppointment.service_id) }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Status:</span>
                    <span :class="getStatusClasses(selectedAppointment.status)">
                      {{ selectedAppointment.status }}
                    </span>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-500">Created:</span>
                    <p class="text-sm text-gray-900">{{ formatDate(selectedAppointment.created_at) }}</p>
                  </div>
                  <div v-if="selectedAppointment.updated_at !== selectedAppointment.created_at">
                    <span class="text-sm font-medium text-gray-500">Last Updated:</span>
                    <p class="text-sm text-gray-900">{{ formatDate(selectedAppointment.updated_at) }}</p>
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button
                      @click="showViewModal = false"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AuthenticatedLayout from '@/components/AuthenticatedLayout.vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

// Data
const appointments = ref([])
const services = ref([
  { id: 1, name: 'General Consultation' },
  { id: 2, name: 'Dental Care' },
  { id: 3, name: 'Pediatrics' },
  { id: 4, name: 'Cardiology' },
  { id: 5, name: 'Orthopedics' }
])

// State
const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedAppointment = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref({
  search: '',
  status: '',
  service: ''
})

// Form
const appointmentForm = ref({
  patient_name: '',
  phone_number: '',
  service_id: '',
  status: 'pending'
})

// Computed
const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(appointment =>
        appointment.patient_name.toLowerCase().includes(search) ||
        appointment.phone_number.includes(search)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(appointment => appointment.status === filters.value.status)
  }

  if (filters.value.service) {
    filtered = filtered.filter(appointment => appointment.service_id == filters.value.service)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredAppointments.value.length / itemsPerPage.value))

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAppointments.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// Methods
const fetchAppointments = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/appointments', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      appointments.value = await response.json()
    } else {
      console.error('Failed to fetch appointments')
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
  } finally {
    loading.value = false
  }
}

const saveAppointment = async () => {
  saving.value = true
  try {
    const url = showEditModal.value
        ? `/api/appointments/${selectedAppointment.value.id}`
        : '/api/appointments'

    const method = showEditModal.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentForm.value)
    })

    if (response.ok) {
      await fetchAppointments()
      closeModal()
    } else {
      console.error('Failed to save appointment')
    }
  } catch (error) {
    console.error('Error saving appointment:', error)
  } finally {
    saving.value = false
  }
}

const deleteAppointment = async (appointment) => {
  if (!confirm(`Are you sure you want to delete the appointment for ${appointment.patient_name}?`)) {
    return
  }

  try {
    const response = await fetch(`/api/appointments/${appointment.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      await fetchAppointments()
    } else {
      console.error('Failed to delete appointment')
    }
  } catch (error) {
    console.error('Error deleting appointment:', error)
  }
}

const viewAppointment = (appointment) => {
  selectedAppointment.value = appointment
  showViewModal.value = true
}

const editAppointment = (appointment) => {
  selectedAppointment.value = appointment
  appointmentForm.value = { ...appointment }
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedAppointment.value = null
  appointmentForm.value = {
    patient_name: '',
    phone_number: '',
    service_id: '',
    status: 'pending'
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    service: ''
  }
  currentPage.value = 1
}

const getServiceName = (serviceId) => {
  const service = services.value.find(s => s.id == serviceId)
  return service ? service.name : 'Unknown Service'
}

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

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Lifecycle
onMounted(() => {
  fetchAppointments()
})
</script>