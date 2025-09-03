<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import Navigation from '../components/Navigation.vue'

const router = useRouter()
const { t } = useI18n()

const ambulanceForm = ref({
  patient_name: '',
  phone_number: '',
  emergency_contact: '',
  pickup_address: '',
  destination: '',
  medical_condition: '',
  urgency_level: '',
  special_requirements: ''
})

const isSubmitting = ref(false)
const errors = ref({})

const urgencyLevels = [
  { value: 'critical', label: t('ambulance.urgency.critical') },
  { value: 'urgent', label: t('ambulance.urgency.urgent') },
  { value: 'routine', label: t('ambulance.urgency.routine') }
]

const destinations = [
  { value: 'wezi', label: t('ambulance.destinations.wezi') },
  { value: 'hospital', label: t('ambulance.destinations.hospital') },
  { value: 'clinic', label: t('ambulance.destinations.clinic') },
  { value: 'other', label: t('ambulance.destinations.other') }
]

const isValidPhone = computed(() => {
  const phone = ambulanceForm.value.phone_number.trim()
  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/
  const digits = phone.replace(/\D/g, '')
  return phoneRegex.test(phone) && digits.length >= 8 && digits.length <= 15
})

const isFormValid = computed(() => {
  return ambulanceForm.value.patient_name.trim() &&
      ambulanceForm.value.phone_number.trim() &&
      ambulanceForm.value.pickup_address.trim() &&
      ambulanceForm.value.destination &&
      ambulanceForm.value.urgency_level &&
      isValidPhone.value
})

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const submitAmbulanceRequest = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  errors.value = {}

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      alert('Ambulance request submitted successfully! We will contact you within 5 minutes.')

      ambulanceForm.value = {
        patient_name: '',
        phone_number: '',
        emergency_contact: '',
        pickup_address: '',
        destination: '',
        medical_condition: '',
        urgency_level: '',
        special_requirements: ''
      }
    } else {
      errors.value = {
        general: 'Failed to submit ambulance request. Please try again.'
      }
    }
  } catch (error) {
    errors.value.general = 'Network error. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
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
            {{ t('ambulance.title') }}
          </h1>
          <p class="mt-4 text-lg text-gray-600">
            {{ t('ambulance.subtitle') }}
          </p>
          <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-800 font-medium">
              {{ t('ambulance.emergency') }}
              <a href="tel:+265996817322" class="text-red-600 hover:text-red-500 underline">
                +265 996 817 322
              </a>
            </p>
          </div>
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

            <form @submit.prevent="submitAmbulanceRequest" class="space-y-6">
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('ambulance.patientInfo') }}</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <BaseInput
                      id="patient_name"
                      :label="t('ambulance.patientName')"
                      v-model="ambulanceForm.patient_name"
                      :placeholder="t('ambulance.placeholders.patientName')"
                      :error="errors.patient_name"
                      :required="true"
                      @focus="clearError('patient_name')"
                  />
                  <BaseInput
                      id="phone_number"
                      :label="t('ambulance.phoneNumber')"
                      v-model="ambulanceForm.phone_number"
                      type="tel"
                      :placeholder="t('ambulance.placeholders.phoneNumber')"
                      :error="errors.phone_number"
                      :required="true"
                      @focus="clearError('phone_number')"
                  />
                </div>
                <div class="mt-6">
                  <BaseInput
                      id="emergency_contact"
                      :label="t('ambulance.emergencyContact')"
                      v-model="ambulanceForm.emergency_contact"
                      type="tel"
                      :placeholder="t('ambulance.placeholders.emergencyContact')"
                      :error="errors.emergency_contact"
                      @focus="clearError('emergency_contact')"
                  />
                </div>
              </div>

              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('ambulance.locationInfo') }}</h3>
                <div class="space-y-6">
                  <BaseInput
                      id="pickup_address"
                      :label="t('ambulance.pickupAddress')"
                      v-model="ambulanceForm.pickup_address"
                      :placeholder="t('ambulance.placeholders.pickupAddress')"
                      :error="errors.pickup_address"
                      :required="true"
                      @focus="clearError('pickup_address')"
                  />
                  <BaseSelect
                      id="destination"
                      :label="t('ambulance.destination')"
                      v-model="ambulanceForm.destination"
                      :placeholder="t('ambulance.placeholders.destination')"
                      :options="destinations"
                      :error="errors.destination"
                      :required="true"
                      @update:modelValue="clearError('destination')"
                  />
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('ambulance.medicalInfo') }}</h3>
                <div class="space-y-6">
                  <BaseSelect
                      id="urgency_level"
                      :label="t('ambulance.urgencyLevel')"
                      v-model="ambulanceForm.urgency_level"
                      :placeholder="t('ambulance.placeholders.urgencyLevel')"
                      :options="urgencyLevels"
                      :error="errors.urgency_level"
                      :required="true"
                      @update:modelValue="clearError('urgency_level')"
                  />
                  <BaseInput
                      id="medical_condition"
                      :label="t('ambulance.medicalCondition')"
                      v-model="ambulanceForm.medical_condition"
                      :placeholder="t('ambulance.placeholders.medicalCondition')"
                      :error="errors.medical_condition"
                      @focus="clearError('medical_condition')"
                  />
                  <BaseInput
                      id="special_requirements"
                      :label="t('ambulance.specialRequirements')"
                      v-model="ambulanceForm.special_requirements"
                      :placeholder="t('ambulance.placeholders.specialRequirements')"
                      :error="errors.special_requirements"
                      @focus="clearError('special_requirements')"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button type="button" @click="router.push('/')"
                        class="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                  {{ t('ambulance.cancel') }}
                </button>
                <button type="submit" :disabled="!isFormValid || isSubmitting"
                        class="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <span v-if="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    {{ t('ambulance.requesting') }}
                  </span>
                  <span v-else>{{ t('ambulance.requestAmbulance') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            {{ t('ambulance.helpText') }}
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>