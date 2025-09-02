<template>
  <AuthenticatedLayout>
    <div class="p-6">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Departments</h1>
          <p class="text-gray-600">Manage hospital departments and their information</p>
        </div>
        <button
            @click="openCreateModal"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Department</span>
        </button>
      </div>

      <!-- Department Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Departments</p>
              <p class="text-2xl font-semibold text-gray-900">{{ departments.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Departments</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeDepartments }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Doctors</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalDoctors }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m0 0a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Services</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalServices }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="flex-1 max-w-md">
            <BaseInput
                v-model="searchTerm"
                placeholder="Search departments..."
                type="text"
            />
          </div>
          <div class="flex space-x-4">
            <BaseSelect
                v-model="statusFilter"
                :options="statusOptions"
                label="Status"
            />
          </div>
        </div>
      </div>

      <!-- Departments Table -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Departments List</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Head of Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctors
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
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
            <tr v-for="department in filteredDepartments" :key="department.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-600 font-medium text-sm">
                        {{ department.name.charAt(0) }}
                      </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ department.name }}</div>
                    <div class="text-sm text-gray-500">{{ department.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ department.headOfDepartment || 'Not assigned' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ department.doctorCount || 0 }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ department.services?.length || 0 }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span
                      :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      department.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ department.status }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                      @click="viewDepartment(department)"
                      class="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  <button
                      @click="editDepartment(department)"
                      class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                      @click="deleteDepartment(department.id)"
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
      </div>

      <!-- Create/Edit Department Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ isEditing ? 'Edit Department' : 'Create Department' }}
            </h3>

            <form @submit.prevent="saveDepartment" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                    v-model="departmentForm.name"
                    label="Department Name"
                    placeholder="Enter department name"
                    required
                />
                <BaseSelect
                    v-model="departmentForm.status"
                    label="Status"
                    :options="statusFormOptions"
                    required
                />
              </div>

              <BaseInput
                  v-model="departmentForm.description"
                  label="Description"
                  placeholder="Enter department description"
                  type="textarea"
                  rows="3"
              />

              <BaseInput
                  v-model="departmentForm.location"
                  label="Location"
                  placeholder="Enter department location"
              />

              <BaseInput
                  v-model="departmentForm.phone"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  type="tel"
              />

              <BaseInput
                  v-model="departmentForm.email"
                  label="Email"
                  placeholder="Enter email address"
                  type="email"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                <div class="space-y-2">
                  <div v-for="(service, index) in departmentForm.services" :key="index" class="flex items-center space-x-2">
                    <input
                        v-model="departmentForm.services[index]"
                        type="text"
                        placeholder="Enter service name"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="button"
                        @click="removeService(index)"
                        class="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                      type="button"
                      @click="addService"
                      class="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    + Add Service
                  </button>
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
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

const departments = ref([])
const searchTerm = ref('')
const statusFilter = ref('all')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const departmentForm = ref({
  name: '',
  description: '',
  location: '',
  phone: '',
  email: '',
  status: 'active',
  services: ['']
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
        department.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || department.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const activeDepartments = computed(() => {
  return departments.value.filter(dept => dept.status === 'active').length
})

const totalDoctors = computed(() => {
  return departments.value.reduce((total, dept) => total + (dept.doctorCount || 0), 0)
})

const totalServices = computed(() => {
  return departments.value.reduce((total, dept) => total + (dept.services?.length || 0), 0)
})

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  departmentForm.value = {
    name: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    status: 'active',
    services: ['']
  }
  showModal.value = true
}

const editDepartment = (department) => {
  isEditing.value = true
  editingId.value = department.id
  departmentForm.value = {
    ...department,
    services: department.services || ['']
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingId.value = null
}

const addService = () => {
  departmentForm.value.services.push('')
}

const removeService = (index) => {
  if (departmentForm.value.services.length > 1) {
    departmentForm.value.services.splice(index, 1)
  }
}

const saveDepartment = async () => {
  try {
    const formData = {
      ...departmentForm.value,
      services: departmentForm.value.services.filter(service => service.trim() !== '')
    }

    if (isEditing.value) {
      // Update existing department
      const index = departments.value.findIndex(dept => dept.id === editingId.value)
      if (index !== -1) {
        departments.value[index] = { ...departments.value[index], ...formData }
      }
    } else {
      // Create new department
      const newDepartment = {
        id: Date.now(),
        ...formData,
        doctorCount: 0,
        headOfDepartment: null
      }
      departments.value.push(newDepartment)
    }

    closeModal()
  } catch (error) {
    console.error('Error saving department:', error)
  }
}

const deleteDepartment = async (departmentId) => {
  if (confirm('Are you sure you want to delete this department?')) {
    try {
      departments.value = departments.value.filter(dept => dept.id !== departmentId)
    } catch (error) {
      console.error('Error deleting department:', error)
    }
  }
}

const viewDepartment = (department) => {
  // Navigate to department details or open view modal
  console.log('Viewing department:', department)
}

onMounted(async () => {
  // Mock data - replace with actual API call
  departments.value = [
    {
      id: 1,
      name: 'Cardiology',
      description: 'Heart and cardiovascular system treatment',
      location: 'Floor 3, Wing A',
      phone: '+1234567890',
      email: 'cardiology@hospital.com',
      status: 'active',
      doctorCount: 5,
      headOfDepartment: 'Dr. John Smith',
      services: ['ECG', 'Echocardiography', 'Cardiac Catheterization']
    },
    {
      id: 2,
      name: 'Pediatrics',
      description: 'Medical care for infants, children, and adolescents',
      location: 'Floor 2, Wing B',
      phone: '+1234567891',
      email: 'pediatrics@hospital.com',
      status: 'active',
      doctorCount: 8,
      headOfDepartment: 'Dr. Sarah Johnson',
      services: ['General Pediatrics', 'Vaccinations', 'Growth Monitoring']
    }
  ]
})
</script>