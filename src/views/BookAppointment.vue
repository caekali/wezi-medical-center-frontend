<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import Navigation from "@/components/Navigation.vue"
import { getDepartments } from '@/services/departmentService'
import { getDoctorAvailabilities, getDoctorByDepartment } from '@/services/doctorService'
import { getDepartmentServices } from '@/services/serviceService'
import { createAppointment } from '@/services/appointmentService'

const router = useRouter()
const { t } = useI18n()

const appointmentForm = ref({
  phone_number: '',
  patient_name: '',
  department_id: '',
  service_id: '',
  appointment_date: '',
  appointment_time: '',
  doctor_id: ''
})

const isSubmitting = ref(false)
const loadingTimeSlots = ref(false)
const services = ref([])
const departments = ref([])
const doctors = ref([])
const availableTimeSlots = ref([])
const errors = ref({})

// Dummy data
const dummyDepartments = [
  { id: 1, name: 'General Medicine' },
  { id: 2, name: 'Dental Care' },
  { id: 3, name: 'Radiology' },
  { id: 4, name: 'Pediatrics' },
  { id: 5, name: 'Antenatal Care' },
  { id: 6, name: 'Emergency Care' }
]

const dummyServices = [
  // General Medicine
  { id: 1, name: 'General Consultation', price: 5000, department_id: 1 },
  { id: 2, name: 'Health Checkup', price: 8000, department_id: 1 },
  { id: 3, name: 'Blood Pressure Monitoring', price: 3000, department_id: 1 },
  // Dental Care
  { id: 4, name: 'Dental Consultation', price: 4000, department_id: 2 },
  { id: 5, name: 'Teeth Cleaning', price: 7000, department_id: 2 },
  { id: 6, name: 'Tooth Extraction', price: 10000, department_id: 2 },
  { id: 7, name: 'Dental Filling', price: 12000, department_id: 2 },
  // Radiology
  { id: 8, name: 'X-Ray', price: 8000, department_id: 3 },
  { id: 9, name: 'CT Scan', price: 25000, department_id: 3 },
  { id: 10, name: 'Ultrasound', price: 15000, department_id: 3 },
  // Pediatrics
  { id: 11, name: 'Child Consultation', price: 6000, department_id: 4 },
  { id: 12, name: 'Vaccination', price: 8000, department_id: 4 },
  { id: 13, name: 'Growth Monitoring', price: 4000, department_id: 4 },
  // Antenatal Care
  { id: 14, name: 'Prenatal Checkup', price: 8000, department_id: 5 },
  { id: 15, name: 'Ultrasound Scan', price: 12000, department_id: 5 },
  { id: 16, name: 'Blood Tests', price: 6000, department_id: 5 },
  // Emergency Care
  { id: 17, name: 'Emergency Consultation', price: 10000, department_id: 6 },
  { id: 18, name: 'Trauma Care', price: 20000, department_id: 6 },
  { id: 19, name: 'Critical Care', price: 30000, department_id: 6 }
]

const dummyDoctors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    specialization: 'General Medicine',
    department_id: 1,
    schedule: {
      monday: { startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      tuesday: { startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      wednesday: { startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      thursday: { startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      friday: { startTime: '09:00', endTime: '17:00', slotDuration: 30 }
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    specialization: 'Dental Surgeon',
    department_id: 2,
    schedule: {
      monday: { startTime: '08:00', endTime: '16:00', slotDuration: 45 },
      tuesday: { startTime: '08:00', endTime: '16:00', slotDuration: 45 },
      wednesday: { startTime: '08:00', endTime: '16:00', slotDuration: 45 },
      thursday: { startTime: '08:00', endTime: '16:00', slotDuration: 45 },
      friday: { startTime: '08:00', endTime: '16:00', slotDuration: 45 }
    }
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    specialization: 'Radiologist',
    department_id: 3,
    schedule: {
      monday: { startTime: '07:00', endTime: '15:00', slotDuration: 30 },
      tuesday: { startTime: '07:00', endTime: '15:00', slotDuration: 30 },
      wednesday: { startTime: '07:00', endTime: '15:00', slotDuration: 30 },
      thursday: { startTime: '07:00', endTime: '15:00', slotDuration: 30 },
      friday: { startTime: '07:00', endTime: '15:00', slotDuration: 30 }
    }
  },
  {
    id: 4,
    name: 'David Thompson',
    specialization: 'Pediatrician',
    department_id: 4,
    schedule: {
      monday: { startTime: '10:00', endTime: '18:00', slotDuration: 30 },
      tuesday: { startTime: '10:00', endTime: '18:00', slotDuration: 30 },
      wednesday: { startTime: '10:00', endTime: '18:00', slotDuration: 30 },
      thursday: { startTime: '10:00', endTime: '18:00', slotDuration: 30 },
      friday: { startTime: '10:00', endTime: '18:00', slotDuration: 30 }
    }
  },
  {
    id: 5,
    name: 'Lisa Williams',
    specialization: 'Obstetrician',
    department_id: 5,
    schedule: {
      monday: { startTime: '09:00', endTime: '17:00', slotDuration: 45 },
      tuesday: { startTime: '09:00', endTime: '17:00', slotDuration: 45 },
      wednesday: { startTime: '09:00', endTime: '17:00', slotDuration: 45 },
      thursday: { startTime: '09:00', endTime: '17:00', slotDuration: 45 },
      friday: { startTime: '09:00', endTime: '17:00', slotDuration: 45 }
    }
  },
  {
    id: 6,
    name: 'Robert Martinez',
    specialization: 'Emergency Medicine',
    department_id: 6,
    schedule: {
      monday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 },
      tuesday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 },
      wednesday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 },
      thursday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 },
      friday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 },
      saturday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 },
      sunday: { startTime: '00:00', endTime: '23:59', slotDuration: 30 }
    }
  }
]

// Load initial data
onMounted(async () => {
  await fetchDepartments()
})

const fetchDepartments = async () => {
  const { success, data, message } = await getDepartments()

  if (success) {
    departments.value = data
  } else {
    errors.value = message
  }
}

const departmentOptions = computed(() =>
    departments.value.map(dep => ({
      value: dep.id,
      label: dep.name
    }))
)

// Load services for selected department (dummy data)
const loadServices = async (departmentId) => {
  services.value = []
  appointmentForm.value.service_id = ''
  if (!departmentId) return

  const { success, data, message } = await getDepartmentServices(departmentId)
  if (success) {
    services.value = data.map(service => ({
      value: service.id,
      label: `${service.name} - MWK ${service.price}`
    }))
  } else {
    errors.value = message
  }
}

// fetch doctors from department
const loadDoctors = async (departmentId) => {
  doctors.value = []
  appointmentForm.value.doctor_id = ''
  appointmentForm.value.appointment_time = ''
  availableTimeSlots.value = []

  if (!departmentId) return

  const { success, data, message } = await getDoctorByDepartment(departmentId)
  if (success) {
    doctors.value = data.map(doctor => ({
      value: doctor.id,
      label: `Dr. ${doctor.name} - ${doctor.specialization || 'General'}`
    }))
  } else {
    errors.value = message
  }
}

// Generate time slots based on doctor's schedule
const generateTimeSlots = (doctorId, date) => {
  const doctor = dummyDoctors.find(d => d.id == doctorId)
  if (!doctor) return []

  const selectedDate = new Date(date)
  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' })

  const daySchedule = doctor.schedule[dayName]
  if (!daySchedule) return []

  const slots = []
  const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number)
  const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number)
  const slotDuration = daySchedule.slotDuration

  let currentTime = startHour * 60 + startMinute // Convert to minutes
  const endTime = endHour * 60 + endMinute

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60)
    const minutes = currentTime % 60

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    const displayTime = formatTime(timeString)

    // Always available for demo
    const isAvailable = true

    slots.push({
      time: timeString,
      displayTime: displayTime,
      available: isAvailable
    })
    console.log(slots)
    currentTime += slotDuration
  }

  return slots
}

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Load available time slots for selected doctor and date
const loadAvailableTimeSlots = async () => {
  if (!appointmentForm.value.doctor_id || !appointmentForm.value.appointment_date) {
    availableTimeSlots.value = []
    return
  }

  loadingTimeSlots.value = true
  appointmentForm.value.appointment_time = ''

  try {
    const { success, data, message } = await getDoctorAvailabilities(appointmentForm.value.doctor_id)

    console.log(data)

    if (success) {
      availableTimeSlots.value = data.map(slot => ({
        value: slot.start_time,
        label: `${slot.start_time} - ${slot.end_time}`,
        available: slot.is_available
      })).filter(slot => slot.available)
    } else {
      errors.value.timeSlots = message
      availableTimeSlots.value = []
    }
  } catch (error) {
    console.error('Error loading time slots:', error)
    availableTimeSlots.value = []
  } finally {
    loadingTimeSlots.value = false
  }
}

// Watch for changes in doctor or date to reload time slots
watch(
    () => [appointmentForm.value.doctor_id, appointmentForm.value.appointment_date],
    () => {
      loadAvailableTimeSlots()
    }
)

const isValidPhone = computed(() => {
  const phone = appointmentForm.value.phone_number.trim()
  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/
  const digits = phone.replace(/\D/g, '')
  return phoneRegex.test(phone) && digits.length >= 8 && digits.length <= 15
})

const isFormValid = computed(() => {
  return appointmentForm.value.patient_name.trim() &&
      appointmentForm.value.phone_number.trim() &&
      appointmentForm.value.department_id &&
      appointmentForm.value.service_id &&
      appointmentForm.value.appointment_date &&
      appointmentForm.value.appointment_time &&
      appointmentForm.value.doctor_id &&
      isValidPhone.value
})

// Get minimum date (today)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Clear errors when user types
const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// Submit appointment
const submitAppointment = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  errors.value = {}

  const result = await createAppointment(appointmentForm.value)

  if (result.success) {
    alert('Appointment booked successfully! We will contact you to confirm.')
    // Reset form
    appointmentForm.value = {
      phone_number: '',
      patient_name: '',
      department_id: '',
      service_id: '',
      appointment_date: '',
      appointment_time: '',
      doctor_id: ''
    }
    availableTimeSlots.value = []
  } else {
    if (result.errors) {
      errors.value = result.errors
    } else {
      errors.value.general = result.message
    }
  }

  isSubmitting.value = false
}

// Service options for select
const serviceOptions = computed(() => services.value)
const doctorOptions = computed(() => doctors.value)
const timeSlotOptions = computed(() => availableTimeSlots.value)

// When department changes, fetch services and doctors
const onDepartmentChange = async (val) => {
  clearError('department_id')
  await Promise.all([
    loadServices(val),
    loadDoctors(val)
  ])
}

// When doctor changes, clear time slots and reload if date is selected
const onDoctorChange = (val) => {
  clearError('doctor_id')
  appointmentForm.value.appointment_time = ''
  if (appointmentForm.value.appointment_date) {
    loadAvailableTimeSlots()
  }
}

// When date changes, reload time slots if doctor is selected
const onDateChange = () => {
  clearError('appointment_date')
  if (appointmentForm.value.doctor_id) {
    loadAvailableTimeSlots()
  }
}
</script>

<template>
  <Navigation />
  <Layout>
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
            {{ t('appointment.title') }}
          </h1>
          <p class="mt-4 text-lg text-gray-600">
            {{ t('appointment.subtitle') }}
          </p>
        </div>

        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="px-6 py-8 sm:p-10">
            <div v-if="errors.general" class="mb-6">
              <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">{{ errors.general }}</p>
                  </div>
                </div>
              </div>
            </div>

            <form @submit.prevent="submitAppointment" class="space-y-6">
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('appointment.patientInfo') }}</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseInput
                      id="patient_name"
                      :label="t('appointment.fullName')"
                      v-model="appointmentForm.patient_name"
                      :placeholder="t('appointment.placeholders.fullName')"
                      :error="errors.patient_name"
                      :required="true"
                      autocomplete="name"
                      @focus="clearError('patient_name')"
                  />
                  <BaseInput
                      id="phone_number"
                      :label="t('appointment.phoneNumber')"
                      v-model="appointmentForm.phone_number"
                      type="tel"
                      :placeholder="t('appointment.placeholders.phoneNumber')"
                      :error="errors.phone_number"
                      :required="true"
                      autocomplete="tel"
                      @focus="clearError('phone_number')"
                  />
                </div>
              </div>

              <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('appointment.appointmentDetails') }}</h3>
              <div class="grid grid-cols-1 gap-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseSelect
                      id="department_id"
                      :label="t('appointment.department')"
                      v-model="appointmentForm.department_id"
                      :placeholder="t('appointment.placeholders.selectDepartment')"
                      :options="departmentOptions"
                      :error="errors.department_id"
                      :required="true"
                      @update:modelValue="onDepartmentChange"
                  />
                  <BaseSelect
                      id="service_id"
                      :label="t('appointment.service')"
                      v-model="appointmentForm.service_id"
                      :placeholder="t('appointment.placeholders.selectService')"
                      :options="serviceOptions"
                      :error="errors.service_id"
                      :required="true"
                      @update:modelValue="clearError('service_id')"
                  />
                </div>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseSelect
                      id="doctor_id"
                      :label="t('appointment.doctor')"
                      :required="true"
                      v-model="appointmentForm.doctor_id"
                      :placeholder="t('appointment.placeholders.selectDoctor')"
                      :options="doctorOptions"
                      :error="errors.doctor_id"
                      @update:modelValue="onDoctorChange"
                  />
                  <BaseInput
                      id="appointment_date"
                      :label="t('appointment.preferredDate')"
                      v-model="appointmentForm.appointment_date"
                      type="date"
                      :min="minDate"
                      :error="errors.appointment_date"
                      :required="true"
                      @change="onDateChange"
                  />
                </div>

                <!-- Time Slot Selection -->
                <div v-if="appointmentForm.doctor_id && appointmentForm.appointment_date">
                  <BaseSelect
                      id="appointment_time"
                      label="Available Time Slots"
                      v-model="appointmentForm.appointment_time"
                      placeholder="Select an available time slot"
                      :options="timeSlotOptions"
                      :error="errors.appointment_time"
                      :required="true"
                      :loading="loadingTimeSlots"
                      @update:modelValue="clearError('appointment_time')"
                  />

                  <!-- Show message if no slots available -->
                  <div v-if="!loadingTimeSlots && availableTimeSlots.length === 0 && appointmentForm.doctor_id && appointmentForm.appointment_date"
                       class="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div class="flex">
                      <svg class="h-4 w-4 text-amber-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      No available time slots for the selected doctor and date. Please choose a different date.
                    </div>
                  </div>

                  <!-- Loading indicator -->
                  <div v-if="loadingTimeSlots" class="mt-2 text-sm text-gray-500 flex items-center">
                    <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading available time slots...
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button type="button" @click="router.push('/')"
                        class="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                  {{ t('appointment.cancel') }}
                </button>
                <button type="submit" :disabled="!isFormValid || isSubmitting"
                        class="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <span v-if="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    {{ t('appointment.booking') }}
                  </span>
                  <span v-else>{{ t('appointment.bookAppointment') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            {{ t('appointment.needHelp') }}
            <a href="tel:+265880333980" class="text-indigo-600 hover:text-indigo-500 font-medium">
              +265 880 33 39 80
            </a>
            {{ t('appointment.contactSupport') }}
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>