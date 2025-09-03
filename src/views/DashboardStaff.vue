<template>
  <AuthenticatedLayout page-title="Staff Management">
    <div class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage hospital staff members and their information</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Staff Member
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input v-model="filters.search" type="text" placeholder="Name, email, or phone..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select v-model="filters.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="clearFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Staff Table -->
      <div class="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Loading staff members...
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredStaff.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  No staff members found
                </td>
              </tr>
              <tr v-else v-for="member in paginatedStaff" :key="member.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ member.first_name }} {{ member.last_name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ member.email }}</div>
                  <div class="text-sm text-gray-500">{{ member.phone_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleClasses(member.role)">
                    {{ formatRole(member.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ member.department || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(member.status)">
                    {{ formatStatus(member.status) }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="editStaff(member)" class="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button @click="deleteStaff(member)" class="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage,
                  filteredStaff.length) }} of {{ filteredStaff.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="currentPage--" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]">
                  {{ page }}
                </button>
                <button @click="currentPage++" :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
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

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ showCreateModal ? 'Add New Staff Member' : 'Edit Staff Member' }}
                </h3>

                <form @submit.prevent="saveStaff" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input v-model="staffForm.first_name" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input v-model="staffForm.last_name" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input v-model="staffForm.email" type="email" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input v-model="staffForm.phone_number" type="tel" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select v-model="staffForm.role" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Role</option>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Admin</option>
                        <option value="technician">Technician</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input v-model="staffForm.department" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select v-model="staffForm.status" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                      <input v-model="staffForm.hire_date" type="date" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" @click="closeModal"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>
                    <button type="submit" :disabled="saving"
                      class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                      {{ saving ? 'Saving...' : (showCreateModal ? 'Add Staff Member' : 'Update Staff Member') }}
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
        <form @submit.prevent="saveStaff" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput v-model="staffForm.first_name" label="First Name" required />
            <BaseInput v-model="staffForm.last_name" label="Last Name" required />
          </div>

          <BaseInput v-model="staffForm.email" label="Email" type="email" required />

          <BaseSelect v-model="staffForm.role" label="Role" :options="roleOptions" required />

          <!-- Show department + specialization if role = doctor -->
          <div v-if="staffForm.role === 'doctor'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseSelect v-model="staffForm.department_id" label="Department" :options="departmentOptions" required />
            <BaseInput v-model="staffForm.specialization" label="Specialization" placeholder="Enter specialization" />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Save Staff
            </button>
          </div>
        </form>

      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AuthenticatedLayout from '@/components/AuthenticatedLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { createUser, deleteUser, getUsers, updateUser } from '@/services/userService'

const authStore = useAuthStore()

// Data
const staff = ref([])

// State
const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedStaff = ref(null)

const currentPage = ref(1)
const itemsPerPage = ref(10)


const filters = ref({
  search: '',
  role: '',
  status: ''
})

const staffForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  role: '',
  department: '',
  status: 'active',
  hire_date: '',
})

// Computed
const filteredStaff = computed(() => {
  let filtered = Array.isArray(staff.value) ? staff.value : []
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(member =>
      member.first_name.toLowerCase().includes(search) ||
      member.last_name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search) ||
      member.phone_number.includes(search)
    )
  }

  if (filters.value.role) {
    filtered = filtered.filter(member => member.role === filters.value.role)
  }

  if (filters.value.status) {
    filtered = filtered.filter(member => member.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredStaff.value.length / itemsPerPage.value))

const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStaff.value.slice(start, end)
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


const viewStaff = (member) => {
  selectedStaff.value = member
  showViewModal.value = true
}

const editStaff = (member) => {
  selectedStaff.value = member
  staffForm.value = { ...member }
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedStaff.value = null
  staffForm.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
    department: '',
    status: 'active',
    hire_date: '',
    salary: '',
    qualifications: ''
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: '',
    status: ''
  }
  currentPage.value = 1
}

const getRoleClasses = (role) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'

  switch (role) {
    case 'doctor':
      return `${baseClasses} bg-blue-100 text-blue-800`
    case 'nurse':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'receptionist':
      return `${baseClasses} bg-purple-100 text-purple-800`
    case 'admin':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'technician':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getStatusClasses = (status) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'

  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'inactive':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'on_leave':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const formatRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')
}

const formatStatus = (status) => {
  if (!status) return ''

  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
}


const formatDate = (dateString) => {
  if (!dateString) return '-'
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
  fetchStaff()
})


const fetchStaff = async () => {
  loading.value = true
  try {
    const response = await getUsers()
    staff.value = response.data
  } catch (error) {
    // Handle error (e.g., show notification)
    staff.value = []
  } finally {
    loading.value = false
  }
}

// Save (create or update) staff member
const saveStaff = async () => {
  saving.value = true
  try {
    if (showCreateModal.value) {
      await createUser(staffForm.value)
    } else if (showEditModal.value && selectedStaff.value) {
      await updateUser(selectedStaff.value.id, staffForm.value)
    }
    await fetchStaff()
    closeModal()
  } catch (error) {
    // Handle error (e.g., show notification)
  } finally {
    saving.value = false
  }
}

// Delete staff member
const deleteStaff = async (member) => {
  if (!confirm('Are you sure you want to delete this staff member?')) return
  loading.value = true
  try {
    await deleteUser(member.id)
    await fetchStaff()
  } catch (error) {
    // Handle error (e.g., show notification)
  } finally {
    loading.value = false
  }
}
</script>