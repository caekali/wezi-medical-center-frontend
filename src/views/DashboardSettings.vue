<!-- src/views/DashboardSettings.vue -->
<template>
  <AuthenticatedLayout page-title="Settings">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your hospital system configuration and preferences</p>
      </div>

      <!-- Settings Tabs -->
      <div class="bg-white shadow-sm border rounded-lg">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- General Settings -->
          <div v-show="activeTab === 'general'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">General Settings</h3>

            <form @submit.prevent="saveGeneralSettings" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                      v-model="generalSettings.hospital_name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                      v-model="generalSettings.contact_email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                      v-model="generalSettings.phone_number"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select
                      v-model="generalSettings.timezone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                    v-model="generalSettings.address"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Appointment Settings -->
          <div v-show="activeTab === 'appointments'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Appointment Settings</h3>

            <form @submit.prevent="saveAppointmentSettings" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Appointment Duration (minutes)</label>
                  <select
                      v-model="appointmentSettings.default_duration"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Advance Booking (days)</label>
                  <input
                      v-model.number="appointmentSettings.max_advance_booking"
                      type="number"
                      min="1"
                      max="365"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours Start</label>
                  <input
                      v-model="appointmentSettings.working_hours_start"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours End</label>
                  <input
                      v-model="appointmentSettings.working_hours_end"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <div class="space-y-2">
                  <label v-for="day in weekDays" :key="day.value" class="flex items-center">
                    <input
                        v-model="appointmentSettings.working_days"
                        :value="day.value"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ day.label }}</span>
                  </label>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                      v-model="appointmentSettings.allow_online_booking"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Allow online appointment booking</label>
                </div>
                <div class="flex items-center">
                  <input
                      v-model="appointmentSettings.require_confirmation"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Require confirmation for new appointments</label>
                </div>
                <div class="flex items-center">
                  <input
                      v-model="appointmentSettings.send_reminders"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">Send appointment reminders</label>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Services -->
          <div v-show="activeTab === 'services'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Services</h3>
              <button
                  @click="showServiceModal = true"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Service
              </button>
            </div>

            <div class="bg-gray-50 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="service in services" :key="service.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ service.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ service.duration }} min
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ service.price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ service.active ? 'Active' : 'Inactive' }}
                      </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        @click="editService(service)"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                        @click="deleteService(service)"
                        class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Notifications -->
          <div v-show="activeTab === 'notifications'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Notification Settings</h3>

            <form @submit.prevent="saveNotificationSettings" class="space-y-6">
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-900">Email Notifications</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                        v-model="notificationSettings.email_new_appointment"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">New appointment notifications</span>
                  </label>
                  <label class="flex items-center">
                    <input
                        v-model="notificationSettings.email_appointment_reminders"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Appointment reminder emails</span>
                  </label>
                  <label class="flex items-center">
                    <input
                        v-model="notificationSettings.email_cancellations"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Appointment cancellation notifications</span>
                  </label>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-900">SMS Notifications</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                        v-model="notificationSettings.sms_appointment_reminders"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">SMS appointment reminders</span>
                  </label>
                  <label class="flex items-center">
                    <input
                        v-model="notificationSettings.sms_confirmations"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">SMS appointment confirmations</span>
                  </label>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Modal -->
    <div v-if="showServiceModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeServiceModal"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingService ? 'Edit Service' : 'Add New Service' }}
                </h3>

                <form @submit.prevent="saveService" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                    <input
                        v-model="serviceForm.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input
                          v-model.number="serviceForm.duration"
                          type="number"
                          min="1"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                          v-model.number="serviceForm.price"
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        v-model="serviceForm.description"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <div class="flex items-center">
                    <input
                        v-model="serviceForm.active"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 text-sm text-gray-700">Active</label>
                  </div>

                  <div class="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        @click="closeServiceModal"
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {{ saving ? 'Saving...' : 'Save Service' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

// State
const activeTab = ref('general')
const saving = ref(false)
const showServiceModal = ref(false)
const editingService = ref(null)

// Data
const tabs = [
  { id: 'general', name: 'General' },
  { id: 'appointments', name: 'Appointments' },
  { id: 'services', name: 'Services' },
  { id: 'notifications', name: 'Notifications' }
]

const weekDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

// Settings
const generalSettings = ref({
  hospital_name: 'Wezi Medical Center',
  contact_email: 'info@wezimedical.com',
  phone_number: '+1-555-0123',
  address: '123 Healthcare Ave, Medical District, City 12345',
  timezone: 'UTC'
})

const appointmentSettings = ref({
  default_duration: 30,
  max_advance_booking: 90,
  working_hours_start: '08:00',
  working_hours_end: '18:00',
  working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  allow_online_booking: true,
  require_confirmation: true,
  send_reminders: true
})

const notificationSettings = ref({
  email_new_appointment: true,
  email_appointment_reminders: true,
  email_cancellations: true,
  sms_appointment_reminders: false,
  sms_confirmations: false
})

const services = ref([
  { id: 1, name: 'General Consultation', duration: 30, price: 150.00, description: 'Standard medical consultation', active: true },
  { id: 2, name: 'Dental Care', duration: 45, price: 200.00, description: 'Dental examination and treatment', active: true },
  { id: 3, name: 'Pediatrics', duration: 30, price: 120.00, description: 'Children healthcare services', active: true },
  { id: 4, name: 'Cardiology', duration: 60, price: 300.00, description: 'Heart and cardiovascular consultation', active: true },
  { id: 5, name: 'X-Ray', duration: 15, price: 80.00, description: 'Diagnostic imaging service', active: true }
])

const serviceForm = ref({
  name: '',
  duration: 30,
  price: 0,
  description: '',
  active: true
})

// Methods
const saveGeneralSettings = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('General settings saved:', generalSettings.value)
    alert('General settings saved successfully!')
  } catch (error) {
    console.error('Error saving general settings:', error)
    alert('Error saving general settings. Please try again.')
  } finally {
    saving.value = false
  }
}

const saveAppointmentSettings = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Appointment settings saved:', appointmentSettings.value)
    alert('Appointment settings saved successfully!')
  } catch (error) {
    console.error('Error saving appointment settings:', error)
    alert('Error saving appointment settings. Please try again.')
  } finally {
    saving.value = false
  }
}

const saveNotificationSettings = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Notification settings saved:', notificationSettings.value)
    alert('Notification settings saved successfully!')
  } catch (error) {
    console.error('Error saving notification settings:', error)
    alert('Error saving notification settings. Please try again.')
  } finally {
    saving.value = false
  }
}

const saveService = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingService.value) {
      // Update existing service
      const index = services.value.findIndex(s => s.id === editingService.value.id)
      if (index !== -1) {
        services.value[index] = { ...serviceForm.value, id: editingService.value.id }
      }
    } else {
      // Add new service
      const newId = Math.max(...services.value.map(s => s.id)) + 1
      services.value.push({ ...serviceForm.value, id: newId })
    }

    closeServiceModal()
    alert('Service saved successfully!')
  } catch (error) {
    console.error('Error saving service:', error)
    alert('Error saving service. Please try again.')
  } finally {
    saving.value = false
  }
}

const editService = (service) => {
  editingService.value = service
  serviceForm.value = { ...service }
  showServiceModal.value = true
}

const deleteService = async (service) => {
  if (!confirm(`Are you sure you want to delete ${service.name}?`)) {
    return
  }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const index = services.value.findIndex(s => s.id === service.id)
    if (index !== -1) {
      services.value.splice(index, 1)
    }

    alert('Service deleted successfully!')
  } catch (error) {
    console.error('Error deleting service:', error)
    alert('Error deleting service. Please try again.')
  }
}

const closeServiceModal = () => {
  showServiceModal.value = false
  editingService.value = null
  serviceForm.value = {
    name: '',
    duration: 30,
    price: 0,
    description: '',
    active: true
  }
}

// Lifecycle
onMounted(() => {
  // Load settings from API if needed
  console.log('Settings component mounted')
})
</script>