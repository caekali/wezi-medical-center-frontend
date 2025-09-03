<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import Navigation from '../components/Navigation.vue'
import heroImage from '@/assets/images/about.jpg'

const { t } = useI18n()

const userLocation = ref(null)
const isLoadingLocation = ref(false)
const locationError = ref('')

// Correct Wezi Medical Center coordinates in Mzuzu
const clinicLocation = {
  lat: -11.465288,
  lng: 34.014964,
  address: "Wezi Medical Center, Mzuzu, Malawi"
}

const getCurrentLocation = () => {
  isLoadingLocation.value = true
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value = t('map.errors.noGeolocation')
    isLoadingLocation.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        isLoadingLocation.value = false
        console.log('Location found:', userLocation.value) // Debug log
      },
      (error) => {
        console.error('Geolocation error:', error)
        switch(error.code) {
          case error.PERMISSION_DENIED:
            locationError.value = t('map.errors.permissionDenied')
            break
          case error.POSITION_UNAVAILABLE:
            locationError.value = t('map.errors.positionUnavailable')
            break
          case error.TIMEOUT:
            locationError.value = t('map.errors.timeout')
            break
          default:
            locationError.value = t('map.errors.locationFailed')
            break
        }
        isLoadingLocation.value = false
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 60000 // Reduced cache time for more accurate location
      }
  )
}

const openInGoogleMaps = () => {
  const destination = `${clinicLocation.lat},${clinicLocation.lng}`

  if (userLocation.value) {
    const origin = `${userLocation.value.lat},${userLocation.value.lng}`
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`
    window.open(url, '_blank')
  } else {
    const url = `https://www.google.com/maps/search/?api=1&query=${destination}`
    window.open(url, '_blank')
  }
}

// Try to get location when component mounts and when user clicks refresh
onMounted(() => {
  getCurrentLocation()
})
</script>

<template>
  <!-- Hero Section with Background Image -->
  <div class="relative bg-cover bg-center bg-no-repeat h-96" :style="`background-image: url(${heroImage});`">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- Navigation within hero section -->
    <div class="relative z-10">
      <Navigation :is-transparent="true" />
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 flex items-center justify-center h-full">
      <div class="max-w-7xl mx-auto px-4 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('map.title') }}</h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">{{ t('map.subtitle') }}</p>
      </div>
    </div>
  </div>

  <Layout>
    <!-- Location Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Location Info -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ t('map.locationInfo') }}</h2>

            <!-- Address Card -->
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <div class="flex items-start">
                <div class="bg-blue-600 rounded-lg p-3 mr-4">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('map.address') }}</h3>
                  <p class="text-gray-600">{{ clinicLocation.address }}</p>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <div class="flex items-start">
                <div class="bg-green-600 rounded-lg p-3 mr-4">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('map.phone') }}</h3>
                  <p class="text-gray-600">+265 996 817 322</p>
                </div>
              </div>
            </div>

            <!-- Operating Hours -->
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-start">
                <div class="bg-indigo-600 rounded-lg p-3 mr-4">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('map.hours') }}</h3>
                  <div class="text-gray-600 space-y-1">
                    <p>{{ t('map.weekdays') }}: 8:00 AM - 6:00 PM</p>
                    <p>{{ t('map.weekends') }}: 9:00 AM - 4:00 PM</p>
                    <p class="text-red-600 font-medium">{{ t('map.emergency') }}: 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Map -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ t('map.directions') }}</h2>

            <!-- Google Maps Embed with correct coordinates -->
            <div class="bg-gray-200 rounded-lg overflow-hidden mb-6" style="height: 400px;">
              <iframe
                  :src="`https://maps.google.com/maps?q=${clinicLocation.lat},${clinicLocation.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>

            <!-- Location Status -->
            <!-- Location Status -->
            <div class="mb-6">
              <div v-if="isLoadingLocation" class="flex items-center text-blue-600">
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ t('map.gettingLocation') }}
              </div>

              <div v-else-if="locationError" class="flex items-center text-red-600">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ locationError }}
              </div>

              <div v-else-if="userLocation" class="flex items-center text-green-600">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ t('map.locationFound') }}
                <span v-if="userLocation.accuracy" class="text-sm text-gray-500 ml-2">
      (±{{ Math.round(userLocation.accuracy) }}m accuracy)
    </span>
              </div>

              <div v-else class="flex items-center text-gray-500">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                Click "Refresh My Location" to enable directions
              </div>
            </div>

            <!-- Navigation Options -->
            <div class="space-y-3">
              <button
                  @click="openInGoogleMaps"
                  class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ t('map.openGoogleMaps') }}
              </button>

              <button
                  @click="getCurrentLocation"
                  class="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ t('map.refreshLocation') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Emergency Contact Section -->
    <section class="bg-red-50 py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ t('map.emergencyTitle') }}</h2>
        <p class="text-xl text-gray-600 mb-8">{{ t('map.emergencyText') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
              href="tel:+265996817322"
              class="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            {{ t('map.callEmergency') }}
          </a>
          <router-link
              to="/book-appointment"
              class="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            {{ t('map.bookAppointment') }}
          </router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>