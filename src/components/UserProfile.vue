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
              <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div v-if="user?.role === 'doctor'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                  v-model="profileForm.department"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div v-if="user?.role === 'doctor'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                  v-model="profileForm.specialization"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div v-if="user?.role !== 'admin'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                  v-model="profileForm.employee_id"
                  type="text"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
                type="submit"
                :disabled="updating"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
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
            <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div class="flex justify-end">
            <button
                type="submit"
                :disabled="changingPassword"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Account Actions Card -->
    <div class="bg-white shadow-sm border rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Account Actions</h2>
        <p class="text-sm text-gray-500">Manage your account settings</p>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div v-if="user?.role !== 'admin'" class="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 class="text-sm font-medium text-red-900">Delete Account</h4>
              <p class="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button
                @click="showDeleteModal = true"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDeleteModal = false"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
                @click="deleteAccount"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete Account
            </button>
            <button
                @click="showDeleteModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
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

const exportData = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data = {
      user: user.value,
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `account-data-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    alert('Account data exported successfully!')
  } catch (error) {
    console.error('Error exporting data:', error)
    alert('Failed to export data. Please try again.')
  }
}

const deleteAccount = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    authStore.logout()
    router.push('/login')

    alert('Account deleted successfully!')
  } catch (error) {
    console.error('Error deleting account:', error)
    alert('Failed to delete account. Please try again.')
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