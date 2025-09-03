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
            <BaseSelect
                v-model="scheduleForm.day"
                label="Day of Week"
                :options="dayOptions"
                required
            />
            <BaseInput
                v-model="scheduleForm.startTime"
                label="Start Time"
                type="time"
                required
            />
            <BaseInput
                v-model="scheduleForm.endTime"
                label="End Time"
                type="time"
                required
            />
            <BaseInput
                v-model="scheduleForm.slotDuration"
                label="Slot Duration (minutes)"
                type="number"
                min="15"
                max="120"
                step="15"
                required
            />
          </div>
          <div class="flex justify-end">
            <button
                type="submit"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
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
            <div
                v-for="schedule in schedules"
                :key="schedule.id"
                class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ schedule.day }}</h4>
                <button
                    @click="deleteSchedule(schedule.id)"
                    class="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
              <p class="text-sm text-gray-600">
                {{ schedule.startTime }} - {{ schedule.endTime }}
              </p>
              <p class="text-xs text-gray-500">
                {{ schedule.slotDuration }} min slots
              </p>
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

const schedules = ref([])
const scheduleForm = ref({
  day: '',
  startTime: '',
  endTime: '',
  slotDuration: 30
})

const dayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

const saveSchedule = async () => {
  try {
    // API call to save schedule
    const newSchedule = {
      id: Date.now(),
      ...scheduleForm.value,
      day: dayOptions.find(d => d.value === scheduleForm.value.day)?.label
    }
    schedules.value.push(newSchedule)

    // Reset form
    scheduleForm.value = {
      day: '',
      startTime: '',
      endTime: '',
      slotDuration: 30
    }
  } catch (error) {
    console.error('Error saving schedule:', error)
  }
}

const deleteSchedule = async (scheduleId) => {
  try {
    schedules.value = schedules.value.filter(s => s.id !== scheduleId)
  } catch (error) {
    console.error('Error deleting schedule:', error)
  }
}

onMounted(async () => {
  // Load existing schedules
  // Replace with actual API call
})
</script>