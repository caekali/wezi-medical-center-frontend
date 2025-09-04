<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentYear = computed(() => new Date().getFullYear())

const quickLinks = computed(() => [
  { name: t('navigation.home'), href: '/' },
  { name: t('navigation.departments'), href: '/departments' },
  { name: t('navigation.bookAppointment'), href: '/book-appointment' },
  { name: t('navigation.bookAmbulance'), href: '/book-ambulance' },
  { name: t('navigation.map'), href: '/map' },
  { name: t('navigation.about'), href: '/about' }
])

const services = computed(() => [
  { name: 'General Medicine', href: '/departments#general-medicine' },
  { name: 'Dental Care', href: '/departments#dental-care' },
  { name: 'Radiology', href: '/departments#radiology' },
  { name: 'Pediatrics', href: '/departments#pediatrics' },
  { name: 'Antenatal Care', href: '/departments#antenatal-care' },
  { name: 'Emergency Care', href: '/departments#emergency-care' }
])

const contactInfo = computed(() => ({
  address: 'M1 Road, Mzuzu, Malawi',
  phone: '+265 880 33 39 80',
  emergency: '0996 817 322',
  email: 'info@wezimedical.com',
  hours: {
    weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
    weekends: 'Saturday - Sunday: 9:00 AM - 4:00 PM',
    emergency: '24/7 Emergency Services Available'
  }
}))

const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'Twitter', href: '#', icon: 'twitter' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' }
]
</script>

<template>
  <footer class="bg-gray-900 text-white">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <!-- Company Info -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-4">
            <div class="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3">
              <img src="../assets/logo.png" alt="Wezi Medical Center Logo" class="h-8 w-8 object-contain">
            </div>
            <span class="text-xl font-bold">Wezi Medical Center</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">
            {{ t('home.subtitle') }}
          </p>
          <div class="flex space-x-4">
            <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.href"
                :aria-label="social.name"
                class="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <!-- Facebook Icon -->
              <svg v-if="social.icon === 'facebook'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <!-- Twitter Icon -->
              <svg v-else-if="social.icon === 'twitter'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <!-- Instagram Icon -->
              <svg v-else-if="social.icon === 'instagram'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.329-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.412-3.329c.881-.881 2.032-1.371 3.329-1.371s2.448.49 3.329 1.371c.922.881 1.412 2.032 1.412 3.329s-.49 2.448-1.412 3.329c-.881.881-2.032 1.297-3.329 1.297z"/>
              </svg>
              <!-- LinkedIn Icon -->
              <svg v-else-if="social.icon === 'linkedin'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link
                  :to="link.href"
                  class="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Our Services</h3>
          <ul class="space-y-2">
            <li v-for="service in services" :key="service.name">
              <router-link
                  :to="service.href"
                  class="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                {{ service.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
          <div class="space-y-3 text-sm">
            <!-- Address -->
            <div class="flex items-start">
              <svg class="h-5 w-5 text-indigo-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-gray-300">{{ contactInfo.address }}</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center">
              <svg class="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a :href="`tel:${contactInfo.phone}`" class="text-gray-300 hover:text-white transition-colors">
                {{ contactInfo.phone }}
              </a>
            </div>

            <!-- Emergency -->
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div>
                <span class="text-red-400 font-medium">Emergency: </span>
                <a :href="`tel:${contactInfo.emergency}`" class="text-gray-300 hover:text-white transition-colors">
                  {{ contactInfo.emergency }}
                </a>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-center">
              <svg class="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a :href="`mailto:${contactInfo.email}`" class="text-gray-300 hover:text-white transition-colors">
                {{ contactInfo.email }}
              </a>
            </div>
          </div>

          <!-- Operating Hours -->
          <div class="mt-4">
            <h4 class="font-medium text-white mb-2">Operating Hours</h4>
            <div class="text-sm text-gray-300 space-y-1">
              <p>{{ contactInfo.hours.weekdays }}</p>
              <p>{{ contactInfo.hours.weekends }}</p>
              <p class="text-red-400">{{ contactInfo.hours.emergency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="md:flex md:items-center md:justify-between">
          <div class="text-center md:text-left">
            <p class="text-sm text-gray-400">
              © {{ currentYear }} Wezi Medical Center. All rights reserved.
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex justify-center md:justify-end space-x-6">
              <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">
                Medical Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Emergency Call-to-Action -->
    <div class="bg-red-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-center">
          <svg class="h-5 w-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span class="text-white text-sm font-medium">
            Medical Emergency? Call {{ contactInfo.emergency }} - Available 24/7
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>