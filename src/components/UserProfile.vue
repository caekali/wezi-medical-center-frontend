<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Profile Settings</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your account information and preferences</p>
      </div>
    </div>

    <!-- Profile Information Card -->
    <div class="bg-white shadow-sm border rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Personal Information</h2>
        <p class="text-sm text-gray-500">Update your personal details and contact information</p>
      </div>

      <div class="p-6">
        <div class="flex items-center space-x-6 mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ user?.name }}</h3>
            <p class="text-sm text-gray-500">{{ getRoleDisplay(user?.role) }}</p>
            <p class="text-sm text-gray-500">{{ user?.email }}</p>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input v-model="profileForm.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input v-model="profileForm.email" type="email" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input v-model="profileForm.phone" type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div v-if="user?.role === 'doctor'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input v-model="profileForm.department" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div v-if="user?.role === 'doctor'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input v-model="profileForm.specialization" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
<!-- 
            <div v-if="user?.role !== 'admin'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input v-model="profileForm.employee_id" type="text" readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500" />
            </div> -->
          </div>

          <div class="flex justify-end">
            <button type="submit" :disabled="updating"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Change Card -->
    <div class="bg-white shadow-sm border rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
        <p class="text-sm text-gray-500">Update your password to keep your account secure</p>
      </div>

      <div class="p-6">
        <form @submit.prevent="changePassword" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input v-model="passwordForm.currentPassword" type="password" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input v-model="passwordForm.newPassword" type="password" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input v-model="passwordForm.confirmPassword" type="password" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div class="flex justify-end">
            <button type="submit" :disabled="changingPassword"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const updating = ref(false)
const changingPassword = ref(false)
const showDeleteModal = ref(false)

// User data
const user = computed(() => authStore.user)

// Forms
const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  employee_id: '',
  department: '',
  specialization: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Methods
const getRoleDisplay = (role) => {
  const roleMap = {
    admin: 'Administrator',
    doctor: 'Doctor',
    helpdesk: 'Help Desk Personnel'
  }
  return roleMap[role] || role
}

const updateProfile = async () => {
  if (updating.value) return

  updating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    authStore.updateUser({
      ...user.value,
      name: profileForm.value.name,
      email: profileForm.value.email,
      phone: profileForm.value.phone,
      department: profileForm.value.department,
      specialization: profileForm.value.specialization
    })

    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (changingPassword.value) return

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match!')
    return
  }

  changingPassword.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    alert('Password changed successfully!')
  } catch (error) {
    console.error('Error changing password:', error)
    alert('Failed to change password. Please try again.')
  } finally {
    changingPassword.value = false
  }
}


// Initialize form data
const initializeForm = () => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      employee_id: user.value.employee_id || '',
      department: user.value.department || '',
      specialization: user.value.specialization || ''
    }
  }
}

onMounted(() => {
  initializeForm()
})
</script>