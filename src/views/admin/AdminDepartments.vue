<template>
  <AuthenticatedLayout>
    <div class="p-6">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Departments</h1>
          <p class="text-gray-600">Manage hospital departments and their information</p>
        </div>
        <button @click="openCreateModal"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Department</span>
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="flex-1 max-w-md">
            <BaseInput v-model="searchTerm" placeholder="Search departments..." type="text" />
          </div>
          <div class="flex space-x-4">
            <BaseSelect v-model="statusFilter" :options="statusOptions" label="Status" />
          </div>
        </div>
      </div>

      <!-- Departments Table -->
      <div class="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                       fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Loading departments...
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredDepartments.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No departments found
              </td>
            </tr>
            <tr v-else v-for="department in paginatedDepartments" :key="department.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-600 font-medium text-sm">
                        {{ department.name.charAt(0) }}
                      </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ department.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ department.description || 'No description' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    department.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]">
                    {{ formatStatus(department.status) }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(department.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button @click="editDepartment(department.id)" class="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button @click="deleteDepartment(department.id)" class="text-red-600 hover:text-red-900">
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
                  filteredDepartments.length) }} of {{ filteredDepartments.length }} results
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

      <!-- Create/Edit Department Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ isEditing ? 'Edit Department' : 'Create Department' }}
            </h3>

            <form @submit.prevent="addDepartment" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput v-model="departmentForm.name" label="Department Name" placeholder="Enter department name"
                           required />
                <BaseSelect v-model="departmentForm.status" label="Status" :options="statusFormOptions" required />
              </div>

              <BaseInput v-model="departmentForm.description" label="Description"
                         placeholder="Enter department description" type="textarea" rows="3" />

              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" @click="closeModal"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  {{ isEditing ? 'Update' : 'Create' }} Department
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AuthenticatedLayout from '@/components/AuthenticatedLayout.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { createDepartment, deleteDepartmentById, getDepartment, getDepartments, updateDepartment } from '@/services/departmentService.js'

const departments = ref([])
const searchTerm = ref('')
const statusFilter = ref('all')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const departmentForm = ref({
  name: '',
  description: '',
  status: 'active',
})

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const statusFormOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const filteredDepartments = computed(() => {
  return departments.value.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (department.description && department.description.toLowerCase().includes(searchTerm.value.toLowerCase()))
    const matchesStatus = statusFilter.value === 'all' || department.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredDepartments.value.length / itemsPerPage.value)
})

const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDepartments.value.slice(start, end)
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
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status) => {
  if(!status) return
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  departmentForm.value = {
    id: null,
    name: '',
    description: '',
    status: 'active',
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
}

const editDepartment = async (id) => {
  const { success, data, errors: validationErrors } = await getDepartment(id)
  if (success) {
    isEditing.value = true
    editingId.value = id
    showModal.value = true
    departmentForm.value = data
  } else {
    console.log('Errors:', validationErrors)
  }
}

const addDepartment = async () => {
  let response

  if (isEditing.value && editingId.value) {
    response = await updateDepartment(editingId.value, departmentForm.value)
  } else {
    response = await createDepartment(departmentForm.value)
  }

  const { success, data, errors: validationErrors } = response

  if (success) {
    if (isEditing.value) {
      const index = departments.value.findIndex(d => d.id === editingId.value)
      if (index !== -1) {
        departments.value[index] = data
      }
    } else {
      departments.value.push(data)
    }
    closeModal()
  } else {
    console.log("Errors:", validationErrors)
  }
}

const deleteDepartment = async (departmentId) => {
  if (confirm('Are you sure you want to delete this department?')) {
    const { success, errors } = await deleteDepartmentById(departmentId)
    if (success) {
      fetchDepartments()
    }
  }
}

const fetchDepartments = async () => {
  loading.value = true
  const { success, data, message } = await getDepartments()
  if (success) {
    departments.value = data
  } else {
    console.error('Error fetching departments:', message)
  }
  loading.value = false
}

onMounted(() => {
  fetchDepartments()
})
</script>