<template>
  <DoctorLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p class="text-gray-600">Manage your patient appointments</p>
      </div>
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8"> <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              :class="['py-2 px-1 border-b-2 font-medium text-sm', activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              {{ tab.name }} <span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100"> {{
                getAppointmentCount(tab.id) }} </span> </button> </nav>
        </div>
      </div>
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900"> {{tabs.find(t => t.id === activeTab)?.name}} Appointments </h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-for="appointment in filteredAppointments" :key="appointment.id" class="p-6 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"> <span
                      class="text-indigo-600 font-medium"> {{ appointment.patient_name.charAt(0) }} </span> </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900"> {{ appointment.patient_name }} </h4>
                  <p class="text-sm text-gray-500">{{ appointment.type }}</p>
                  <p class="text-xs text-gray-400"> {{ formatDateTime(appointment.datetime) }} </p>
                </div>
              </div>
              <div class="flex items-center space-x-2"> <span
                  :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(appointment.status)]"> {{
                    appointment.status }} </span> <button v-if="appointment.status === 'scheduled'"
                  @click="openRescheduleModal(appointment)" class="text-blue-600 hover:text-blue-800 text-sm">
                  Reschedule </button> <button v-if="appointment.status === 'scheduled'"
                  @click="updateAppointmentStatus(appointment.id, 'completed')"
                  class="text-green-600 hover:text-green-800 text-sm"> Complete </button> <button
                  v-if="appointment.status === 'scheduled'"
                  @click="updateAppointmentStatus(appointment.id, 'cancelled')"
                  class="text-red-600 hover:text-red-800 text-sm"> Cancel </button> </div>
            </div>
          </div>
        </div>
      </div> <!-- Reschedule Modal -->
      <div v-if="showRescheduleModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Reschedule Appointment</h3>
            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-2"> Patient: <span class="font-medium">{{
                selectedAppointment?.patient.name }}</span> </p>
              <p class="text-sm text-gray-600 mb-4"> Current: <span class="font-medium">{{
                formatDateTime(selectedAppointment?.datetime) }}</span> </p>
            </div>
            <form @submit.prevent="rescheduleAppointment" class="space-y-4">
              <div> <label class="block text-sm font-medium text-gray-700 mb-1"> New Date </label> <input
                  v-model="rescheduleForm.date" type="date" :min="getTodayDate()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required /> </div>
              <div> <label class="block text-sm font-medium text-gray-700 mb-1"> New Time </label> <input
                  v-model="rescheduleForm.time" type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required />
                <p class="text-xs text-gray-500 mt-1">Select any time between 09:00 and 17:00</p>
              </div>
              <div> <label class="block text-sm font-medium text-gray-700 mb-1"> Reason for Reschedule (Optional)
                </label> <textarea v-model="rescheduleForm.reason" rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter reason for rescheduling..." /> </div> <!-- Time Conflict Warning -->
              <div v-if="timeConflict" class="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div class="flex"> <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd" />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-800"> Warning: This time slot conflicts with an existing appointment.
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-3 pt-4"> <button type="button" @click="closeRescheduleModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"> Cancel
                </button> <button type="submit" :disabled="!rescheduleForm.date || !rescheduleForm.time || !isValidTime"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Reschedule </button> </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DoctorLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DoctorLayout from '@/components/DoctorLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { getAppointmentsForDoctor, updateAppointment } from '@/services/appointmentService'

const activeTab = ref('today')
const appointments = ref([])
const showRescheduleModal = ref(false)
const selectedAppointment = ref(null)
const auth = useAuthStore()
const profileId = computed(() => auth.profileId)

const rescheduleForm = ref({
  date: '',
  time: '',
  reason: ''
})

const tabs = [
  { id: 'today', name: 'Today' },
  { id: 'pending', name: 'Pending' },
  { id: 'confirmed', name: 'Confirmed' },
  { id: 'completed', name: 'Completed' },
  { id: 'rescheduled', name: 'Rescheduled' },
  { id: 'cancelled', name: 'Cancelled' }


]

const filteredAppointments = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return appointments.value.filter(appointment => {
    const appointmentDate = new Date(appointment.datetime)
    appointmentDate.setHours(0, 0, 0, 0)

    switch (activeTab.value) {
      case 'today':
        return appointmentDate.getTime() === today.getTime() && appointment.status === 'pending'
      case 'pending':
        return appointmentDate > today && appointment.status === 'pending'
      case 'confirmed':
        return appointment.status === 'confirmed'
      case 'completed':
        return appointment.status === 'completed'
      case 'rescheduled':
        return appointment.status === 'rescheduled'
      case 'cancelled':
        return appointment.status === 'cancelled'
      default:
        return true
    }
  })
})

const isValidTime = computed(() => {
  if (!rescheduleForm.value.time) return false
  const [hours, minutes] = rescheduleForm.value.time.split(':').map(Number)
  const timeInMinutes = hours * 60 + minutes
  const startTime = 9 * 60
  const endTime = 17 * 60
  return timeInMinutes >= startTime && timeInMinutes <= endTime
})

const timeConflict = computed(() => {
  if (!rescheduleForm.value.date || !rescheduleForm.value.time) return false
  const newDateTime = new Date(`${rescheduleForm.value.date}T${rescheduleForm.value.time}`)
  return appointments.value.some(apt => {
    if (apt.id === selectedAppointment.value?.id || apt.status !== 'scheduled') return false
    const existingDateTime = new Date(apt.datetime)
    return Math.abs(newDateTime.getTime() - existingDateTime.getTime()) < 30 * 60 * 1000
  })
})

const getAppointmentCount = (tabId) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return appointments.value.filter(appointment => {
    const appointmentDate = new Date(appointment.datetime)
    appointmentDate.setHours(0, 0, 0, 0)

    switch (tabId) {
      case 'today':
        return appointmentDate.getTime() === today.getTime() && appointment.status === 'scheduled'
      case 'pending':
        return appointmentDate > today && appointment.status === 'pending'
      case 'confirmed':
        return appointment.status === 'confirmed'
        case 'completed':
        return appointment.status === 'completed'
      case 'rescheduled':
        return appointment.status === 'rescheduled'
      case 'cancelled':
        return appointment.status === 'cancelled'
      default:
        return true
    }
  }).length
}

const getStatusClass = (status) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDateTime = (datetime) => new Date(datetime).toLocaleString()
const getTodayDate = () => new Date().toISOString().split('T')[0]

const openRescheduleModal = (appointment) => {
  selectedAppointment.value = appointment
  showRescheduleModal.value = true
  rescheduleForm.value = { date: '', time: '', reason: '' }
}

const closeRescheduleModal = () => {
  showRescheduleModal.value = false
  selectedAppointment.value = null
}

const rescheduleAppointment = async () => {
  try {
    if (!isValidTime.value) {
      alert('Please select a time between 09:00 and 17:00')
      return
    }

    const newDateTime = new Date(`${rescheduleForm.value.date}T${rescheduleForm.value.time}`)
    const appointmentIndex = appointments.value.findIndex(a => a.id === selectedAppointment.value.id)
    if (appointmentIndex !== -1) {
      appointments.value[appointmentIndex].datetime = newDateTime.toISOString()
      if (!appointments.value[appointmentIndex].rescheduleHistory) {
        appointments.value[appointmentIndex].rescheduleHistory = []
      }
      appointments.value[appointmentIndex].rescheduleHistory.push({
        oldDateTime: selectedAppointment.value.datetime,
        newDateTime: newDateTime.toISOString(),
        reason: rescheduleForm.value.reason,
        timestamp: new Date().toISOString()
      })
    }

    closeRescheduleModal()
    console.log('Appointment rescheduled successfully')
  } catch (error) {
    console.error('Error rescheduling appointment:', error)
  }
}


const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (!appointment) return

    const updatedData = { ...appointment, status }

    const result = await updateAppointment(appointmentId, updatedData)

    if (result.success) {
      appointment.status = status
      console.log(`Appointment ${appointmentId} updated successfully`)
    } else {
      console.error('Failed to update appointment:', result.message)
    }
  } catch (error) {
    console.error('Error updating appointment:', error)
  }
}

const fetchAppointments = async () => {
  if (!profileId.value) return
  appointments.value = []
  const result = await getAppointmentsForDoctor(profileId.value)
  if (result.success) {
    appointments.value = result.data.map(apt => ({
      ...apt,
      datetime: `${apt.appointment_date}T${apt.appointment_time}`
    }))
  }
}

onMounted(fetchAppointments)
watch(profileId, fetchAppointments)
</script>
