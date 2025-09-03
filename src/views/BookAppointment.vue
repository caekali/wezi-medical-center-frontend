<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import Navigation from "@/components/Navigation.vue";
import { getDepartments } from '@/services/departmentService'
import { getDoctorByDepartment } from '@/services/doctorService'
import { getDepartmentServices } from '@/services/serviceService'
import { createAppointment } from '@/services/appointmentService'

const router = useRouter()

const appointmentForm = ref({
  phone_number: '',
  patient_name: '',
  department_id: '',
  service_id: '',
  appointment_date: '',
  appointment_time: '20:30',
  doctor_id: ''
})

const isSubmitting = ref(false)
const services = ref([])
const departments = ref([])
const doctors = ref([])
const availableTimeSlots = ref([])
const errors = ref({})

// Load initial data
onMounted(async () => {
  await Promise.all([
    generateTimeSlots(),
    fetchDepartments()
  ])
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

// load department
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

// Generate time slots
const generateTimeSlots = () => {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })

      slots.push({
        value: timeString,
        label: displayTime
      })
    }
  }

  availableTimeSlots.value = slots
}

const isValidPhone = computed(() => {
  const phone = appointmentForm.value.phone_number.trim()

  // Allow +, spaces, parentheses, dashes
  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/

  // Extract digits only
  const digits = phone.replace(/\D/g, '')

  // Must be 8–15 digits (E.164 range)
  return phoneRegex.test(phone) && digits.length >= 8 && digits.length <= 15
})


const isFormValid = computed(() => {
  return appointmentForm.value.patient_name.trim() &&
    appointmentForm.value.phone_number.trim() &&
    appointmentForm.value.department_id &&
    appointmentForm.value.service_id &&
    appointmentForm.value.appointment_date &&
    appointmentForm.value.appointment_time &&
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
    // router.push('/')
  } else {
    if (result.errors) {
      errors.value = result.errors
    } else {
      errors.value.general = result.message
    }
  }


  appointmentForm.value = {
    phone_number: '',
    patient_name: '',
    department_id: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '20:30',
    doctor_id: ''
  }

  isSubmitting.value = false
}

// Service options for select
const serviceOptions = computed(() => services.value)
const doctorOptions = computed(() => doctors.value)

// When department changes, fetch services and doctors
const onDepartmentChange = async (val) => {
  clearError('department_id')
  await Promise.all([
    loadServices(val),
    loadDoctors(val)
  ])
}
</script>

<template>
  <Navigation />
  <Layout>
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
            Book an Appointment
          </h1>
          <p class="mt-4 text-lg text-gray-600">
            Schedule your visit with our medical professionals
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
                <h3 class="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseInput id="patient_name" label="Full Name" v-model="appointmentForm.patient_name"
                    placeholder="Enter your full name" :error="errors.patient_name" :required="true" autocomplete="name"
                    @focus="clearError('patient_name')" />
                  <BaseInput id="phone_number" label="Phone Number" v-model="appointmentForm.phone_number" type="tel"
                    placeholder="Phone number" :error="errors.phone_number" :required="true" autocomplete="tel"
                    @focus="clearError('phone_number')" />
                </div>

              </div>

              <h3 class="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
              <div class="grid grid-cols-1 gap-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseSelect id="department_id" label="Department" v-model="appointmentForm.department_id"
                    placeholder="Select a department" :options="departmentOptions" :error="errors.department_id"
                    :required="true" @update:modelValue="onDepartmentChange" />
                  <BaseSelect id="service_id" label="Service" v-model="appointmentForm.service_id"
                    placeholder="Select a service" :options="serviceOptions" :error="errors.service_id" :required="true"
                    @update:modelValue="clearError('service_id')" />
                </div>


                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseSelect id="doctor_id" label="Doctor" :required="true" v-model="appointmentForm.doctor_id"
                    placeholder="Select a doctor" :options="doctorOptions" :error="errors.doctor_id"
                    @update:modelValue="clearError('doctor_id')" />
                  <BaseInput id="appointment_date" label="Preferred Date" v-model="appointmentForm.appointment_date"
                    type="date" :min="minDate" :error="errors.appointment_date" :required="true"
                    @focus="clearError('appointment_date')" />

                </div>
              </div>

              <!-- <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div class="flex">
                  <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="ml-3">
                    <h4 class="text-sm font-medium text-blue-800">Important Information</h4>
                    <div class="mt-2 text-sm text-blue-700">
                      <ul class="list-disc list-inside space-y-1">
                        <li>Please arrive 15 minutes before your appointment</li>
                        <li>Bring your insurance card and valid ID</li>
                        <li>We will call to confirm your appointment within 24 hours</li>
                        <li>For emergencies, call 911 or visit our emergency department</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div> -->

              <div class="flex justify-end space-x-3">
                <button type="button" @click="router.push('/')"
                  class="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                  Cancel
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
                    Booking...
                  </span>
                  <span v-else>Book Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Need help booking? Call us at
            <a href="tel:+1234567890" class="text-indigo-600 hover:text-indigo-500 font-medium">
              (111) 456-7890
            </a>
            or
            <router-link to="/contact" class="text-indigo-600 hover:text-indigo-500 font-medium">
              contact support
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>
