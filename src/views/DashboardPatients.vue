<!-- src/views/DashboardPatients.vue -->
<template>
  <AuthenticatedLayout page-title="Patient Management">
    <div class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Patient Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage patient records and information</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Patient
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
                placeholder="Name, email, or phone..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
                v-model="filters.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select
                v-model="filters.blood_group"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
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

      <!-- Patients Table -->
      <div class="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-2">Loading patients...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredPatients.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                No patients found.
              </td>
            </tr>
            <tr v-else v-for="patient in paginatedPatients" :key="patient.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-indigo-700">
                          {{ getInitials(patient.first_name, patient.last_name) }}
                        </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ patient.first_name }} {{ patient.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ patient.patient_id || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ patient.email }}</div>
                <div class="text-sm text-gray-500">{{ patient.phone_number }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ calculateAge(patient.date_of_birth) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {{ formatGender(patient.gender) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ patient.blood_group || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(patient.last_visit) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                      @click="viewPatient(patient)"
                      class="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  <button
                      @click="editPatient(patient)"
                      class="text-yellow-600 hover:text-yellow-900"
                  >
                    Edit
                  </button>
                  <button
                      @click="deletePatient(patient)"
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
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredPatients.length) }} of {{ filteredPatients.length }} results
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
                    :disabled="page === '...'"
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

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ showCreateModal ? 'Add New Patient' : 'Edit Patient' }}
                </h3>

                <form @submit.prevent="savePatient" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                          v-model="patientForm.first_name"
                          type="text"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                          v-model="patientForm.last_name"
                          type="text"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                          v-model="patientForm.email"
                          type="email"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                          v-model="patientForm.phone_number"
                          type="tel"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                          v-model="patientForm.date_of_birth"
                          type="date"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                          v-model="patientForm.gender"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                          v-model="patientForm.blood_group"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        v-model="patientForm.address"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                        v-model="patientForm.emergency_contact"
                        type="tel"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                    <textarea
                        v-model="patientForm.medical_history"
                        rows="3"
                        placeholder="Any relevant medical history, allergies, or conditions..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
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
                      {{ saving ? 'Saving...' : 'Save Patient' }}
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
                  Patient Details
                </h3>

                <div v-if="selectedPatient" class="space-y-3">
                  <div>
                    <label class="text-sm font-medium text-gray-500">Full Name</label>
                    <p class="text-sm text-gray-900">{{ selectedPatient.first_name }} {{ selectedPatient.last_name }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-sm font-medium text-gray-500">Email</label>
                      <p class="text-sm text-gray-900">{{ selectedPatient.email }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Phone</label>
                      <p class="text-sm text-gray-900">{{ selectedPatient.phone_number }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="text-sm font-medium text-gray-500">Age</label>
                      <p class="text-sm text-gray-900">{{ calculateAge(selectedPatient.date_of_birth) }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Gender</label>
                      <p class="text-sm text-gray-900">{{ formatGender(selectedPatient.gender) }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Blood Group</label>
                      <p class="text-sm text-gray-900">{{ selectedPatient.blood_group || 'N/A' }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Address</label>
                    <p class="text-sm text-gray-900">{{ selectedPatient.address || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Emergency Contact</label>
                    <p class="text-sm text-gray-900">{{ selectedPatient.emergency_contact || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500">Medical History</label>
                    <p class="text-sm text-gray-900">{{ selectedPatient.medical_history || 'None recorded' }}</p>
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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Data
const patients = ref([])

// State
const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedPatient = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref({
  search: '',
  gender: '',
  blood_group: ''
})

// Form
const patientForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  date_of_birth: '',
  gender: '',
  blood_group: '',
  address: '',
  emergency_contact: '',
  medical_history: ''
})

// Computed
const filteredPatients = computed(() => {
  let filtered = patients.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(patient =>
        patient.first_name.toLowerCase().includes(search) ||
        patient.last_name.toLowerCase().includes(search) ||
        patient.email.toLowerCase().includes(search) ||
        patient.phone_number.includes(search)
    )
  }

  if (filters.value.gender) {
    filtered = filtered.filter(patient => patient.gender === filters.value.gender)
  }

  if (filters.value.blood_group) {
    filtered = filtered.filter(patient => patient.blood_group === filters.value.blood_group)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPatients.value.length / itemsPerPage.value))

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPatients.value.slice(start, end)
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
const fetchPatients = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/patients', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      patients.value = await response.json()
    } else {
      console.error('Failed to fetch patients')
    }
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const savePatient = async () => {
  saving.value = true
  try {
    const url = showEditModal.value
        ? `/api/patients/${selectedPatient.value.id}`
        : '/api/patients'

    const method = showEditModal.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientForm.value)
    })

    if (response.ok) {
      await fetchPatients()
      closeModal()
    } else {
      const errorData = await response.json()
      console.error('Failed to save patient:', errorData)
      alert('Error saving patient. Please check the form and try again.')
    }
  } catch (error) {
    console.error('Error saving patient:', error)
    alert('Error saving patient. Please try again.')
  } finally {
    saving.value = false
  }
}

const deletePatient = async (patient) => {
  if (!confirm(`Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`)) {
    return
  }

  try {
    const response = await fetch(`/api/patients/${patient.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      await fetchPatients()
    } else {
      console.error('Failed to delete patient')
      alert('Error deleting patient. Please try again.')
    }
  } catch (error) {
    console.error('Error deleting patient:', error)
    alert('Error deleting patient. Please try again.')
  }
}

const viewPatient = (patient) => {
  selectedPatient.value = patient
  showViewModal.value = true
}

const editPatient = (patient) => {
  selectedPatient.value = patient
  patientForm.value = { ...patient }
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedPatient.value = null
  patientForm.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    emergency_contact: '',
    medical_history: ''
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    gender: '',
    blood_group: ''
  }
  currentPage.value = 1
}

const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const formatGender = (gender) => {
  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A'
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watchers
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Lifecycle
onMounted(() => {
  fetchPatients()
})
</script>