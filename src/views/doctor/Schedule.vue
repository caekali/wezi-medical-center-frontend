<template>
  <DoctorLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p class="text-gray-600">Manage your availability and working hours</p>
      </div>

      <!-- Schedule Form -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Set Availability</h3>
        <form @submit.prevent="saveSchedule" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseSelect v-model="scheduleForm.day" label="Day of Week" :options="dayOptions" required />
            <BaseInput v-model="scheduleForm.startTime" label="Start Time" type="time" required />
            <BaseInput v-model="scheduleForm.endTime" label="End Time" type="time" required />
            <BaseInput v-model="scheduleForm.slotDuration" label="Slot Duration (minutes)" type="number" min="15"
              max="120" step="15" required />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Save Schedule
            </button>
          </div>
        </form>
      </div>

      <!-- Current Schedule -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Current Schedule</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="schedule in schedules" :key="schedule.id" class="border rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ schedule.day_of_week }}</h4>
                <button @click="removeSchedule(schedule.id)" class="text-red-600 hover:text-red-800 text-sm">
                  Delete
                </button>
              </div>

              <p class="text-sm text-gray-600">
                {{ schedule.start_time }} - {{ schedule.end_time }}
              </p>
              <p class="text-xs text-gray-500">
                {{ schedule.slot_duration }} min slots
              </p>

              <!-- Availability toggle -->
              <div class="mt-2 flex items-center">
                <input type="checkbox" :checked="schedule.is_available" @change="toggleAvailability(schedule)"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                <label class="ml-2 text-sm text-gray-700">
                  Available
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DoctorLayout from '@/components/DoctorLayout.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import {
  getDoctorAvailabilities,
  createDoctorAvailability,
  deleteDoctorAvailability,
  updateDoctorAvailability
} from '@/services/doctorService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const schedules = ref([])
const scheduleForm = ref({

  day: '',
  startTime: '',
  endTime: '',
  slotDuration: 30
  ,
  is_available: false
})

const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
]


const toggleAvailability = async (schedule) => {
  try {
    const { success, data, message } = await updateDoctorAvailability(schedule.id, {
      is_available: !schedule.is_available
    })
    if (success) {
      schedule.is_available = data.is_available
    } else {
      console.error('Failed to update availability:', message)
    }
  } catch (err) {
    console.error(err)
  }
}


// --- Fetch schedules ---
const loadSchedules = async () => {
  try {

    const { success, data, message } = await getDoctorAvailabilities(authStore.profileId)
    if (success) {
      schedules.value = data

    } else {
      console.error('Failed to load schedules:', message)
    }
  } catch (err) {
    console.error(err)
  }
}

// --- Save schedule ---
const saveSchedule = async () => {
  try {
    const payload = {
      doctor_id: authStore.profileId,
      day_of_week: scheduleForm.value.day,
      start_time: scheduleForm.value.startTime,
      end_time: scheduleForm.value.endTime,
      slot_duration: scheduleForm.value.slotDuration
    }

    const { success, data, message } = await createDoctorAvailability(payload)
    if (success) {
      schedules.value.push(data)
      // Reset form
      scheduleForm.value = {
        day: '',
        startTime: '',
        endTime: '',
        slotDuration: 30
      }
    } else {
      console.error('Error saving schedule:', message)
    }
  } catch (err) {
    console.error(err)
  }
}

// --- Delete schedule ---
const removeSchedule = async (scheduleId) => {
  try {
    const { success, message } = await deleteDoctorAvailability(scheduleId)
    if (success) {
      schedules.value = schedules.value.filter(s => s.id !== scheduleId)
    } else {
      console.error('Error deleting schedule:', message)
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadSchedules)
</script>
