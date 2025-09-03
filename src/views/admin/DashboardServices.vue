<template>
    <AuthenticatedLayout>
        <div class="p-6">
            <div class="mb-6 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Services</h1>
                    <p class="text-gray-600">Manage hospital departmental services</p>
                </div>
                <button @click="openCreateModal"
                    class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Service</span>
                </button>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white p-4 rounded-lg shadow mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div class="flex-1 max-w-md">
                        <BaseInput v-model="searchTerm" placeholder="Search service..." type="text" />
                    </div>
                    <div class="flex space-x-4">
                        <BaseSelect v-model="statusFilter" :options="statusOptions" label="Status" />
                    </div>


                </div>
            </div>

            <!-- Departments Table -->
            <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Service List</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>

                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="service in filteredServices" :key="service.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <span class="text-indigo-600 font-medium text-sm">
                                                {{ service.name.charAt(0) }}
                                            </span>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                                            <!-- <div class="text-sm text-gray-500">{{ department.description }}</div> -->
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ service.department }}
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                                        service.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ service.status }}
                                    </span>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ service.price }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button @click="editService(service.department_id, service.id)"
                                            class="text-blue-600 hover:text-blue-900">
                                            Edit
                                        </button>
                                        <button @click="deleteService(service.department_id, service.id)"
                                            class="text-red-600 hover:text-red-900">
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
                            {{ isEditing ? 'Edit Service' : 'Create Service' }}
                        </h3>

                        <form @submit.prevent="addService" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaseInput v-model="serviceForm.name" label="Service Name"
                                    placeholder="Enter service name" required />
                                <BaseSelect v-model="serviceForm.status" label="Status" :options="statusFormOptions"
                                    required />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BaseInput v-model="serviceForm.price" label="Service Price (Mwk)"
                                    placeholder="Enter service name" required />
                                <BaseSelect v-model="serviceForm.status" label="Status" :options="statusFormOptions"
                                    required />
                            </div>

                            <BaseSelect v-model="serviceForm.department_id" label="Department"
                                :options="departmentOptions" required />

                            <div class="flex justify-end space-x-3 pt-4">
                                <button type="button" @click="closeModal"
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                    Cancel
                                </button>
                                <button type="submit"
                                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                    {{ isEditing ? 'Update' : 'Create' }} Service
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
import { deleteDepartmentById, getDepartments } from '@/services/departmentService.js'
import { createDepartmentService, deleteDepartmentService, getDepartmentService, getServices, updateDepartmentService } from '@/services/serviceService.js'

const departments = ref([])
const serivces = ref([])
const searchTerm = ref('')
const statusFilter = ref('all')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const serviceForm = ref({
    name: '',
    department_id: '',
    price: '',
    status: 'active',
})


const departmentOptions = computed(() =>
    departments.value.map(dep => ({
        value: dep.id,
        label: dep.name
    }))
)

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
]

const statusFormOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
]

const filteredServices = computed(() => {
    return serivces.value.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        const matchesStatus = statusFilter.value === 'all' || department.status === statusFilter.value
        return matchesSearch && matchesStatus
    })
})


const openCreateModal = () => {
    isEditing.value = false
    editingId.value = null
    serviceForm.value = {
        id: null,
        name: '',
        price: null,
        department_id: '',
        status: 'active',
    }
    showModal.value = true
}


const closeModal = () => {
    showModal.value = false
    isEditing.value = false
    editingId.value = null
}


const editService = async (departmentId, serviceId) => {
    const { success, data, errors: validationErrors } = await getDepartmentService(departmentId, serviceId)
    if (success) {
        isEditing.value = true
        editingId.value = serviceId
        showModal.value = true
        serviceForm.value = data

    } else {
        console.log('Errors:', validationErrors)
    }
}

const addService = async () => {
    let response;

    if (isEditing.value && editingId.value) {
        // Update existing service
        response = await updateDepartmentService(
            serviceForm.value.department_id,
            editingId.value,
            serviceForm.value
        )
    } else {
        // Create new service
        response = await createDepartmentService(
            serviceForm.value.department_id,
            serviceForm.value
        )
    }

    const { success, data, errors: validationErrors } = response;

    if (success) {
        if (isEditing.value) {
            // Update list in place
            const index = serivces.value.findIndex(s => s.id === editingId.value);
            if (index !== -1) {
                serivces.value[index] = data;
            }
        } else {
            // Push new item
            serivces.value.push(data);
        }
        closeModal();
    } else {
        console.log("Errors:", validationErrors);
    }
};


const deleteService = async (departmentId, serviceId) => {
    if (confirm('Are you sure you want to delete this department?')) {
        const { success, errors } = await deleteDepartmentService(departmentId, serviceId)
        fetchService();
    }
}

const fetchDepartments = async () => {
    const { success, data, message } = await getDepartments()
    if (success) {
        departments.value = data

    } else {
        errors.value = message
    }
}




const fetchService = async () => {
    const { success, data, message } = await getServices()
    if (success) {
        serivces.value = data
    } else {
        errors.value = message
    }
}

onMounted(() => {
    fetchService()
    fetchDepartments()
})
</script>