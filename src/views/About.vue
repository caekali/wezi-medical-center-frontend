<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import Navigation from '../components/Navigation.vue'
import heroImage from '@/assets/images/about1.jpg'
import Footer from "@/components/Footer.vue";

const { t } = useI18n()
const router = useRouter()

const values = ['compassion', 'excellence', 'integrity', 'innovation']

const teamMembers = [
  { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', image: '/images/staff/dr-sarah.jpg' },
  { name: 'Dr. Michael Chen', role: 'Lead Dental Surgeon', image: '/images/staff/dr-michael.jpg' },
  { name: 'Dr. Emily Rodriguez', role: 'Senior Radiologist', image: '/images/staff/dr-emily.jpg' }
]

const navigateToBooking = () => {
  router.push('/book-appointment')
}
</script>

<template>
  <!-- Hero Section with Background Image -->
  <div class="relative bg-cover bg-top bg-no-repeat h-96" :style="`background-image: url(${heroImage});`">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- Navigation within hero section -->
    <div class="relative z-10">
      <Navigation :transparent="true" />
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 flex items-center justify-center h-full">
      <div class="max-w-7xl mx-auto px-4 text-center text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('about.title') }}</h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">{{ t('about.subtitle') }}</p>
      </div>
    </div>
  </div>

  <Layout>
    <!-- Mission & Vision Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-blue-600 rounded-lg p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-2xl font-bold text-gray-900">{{ t('about.mission.title') }}</h2>
          </div>
          <p class="text-gray-600 leading-relaxed">{{ t('about.mission.content') }}</p>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-indigo-600 rounded-lg p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-2xl font-bold text-gray-900">{{ t('about.vision.title') }}</h2>
          </div>
          <p class="text-gray-600 leading-relaxed">{{ t('about.vision.content') }}</p>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-12">{{ t('about.values.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in values" :key="value" class="text-center">
            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg v-if="value === 'compassion'" class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <svg v-else-if="value === 'excellence'" class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                <svg v-else-if="value === 'integrity'" class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <svg v-else-if="value === 'innovation'" class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t(`about.values.${value}.title`) }}</h3>
              <p class="text-gray-600 text-sm">{{ t(`about.values.${value}.content`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ t('about.team.title') }}</h2>
        <p class="text-xl text-gray-600 mb-12">{{ t('about.team.subtitle') }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="member in teamMembers" :key="member.name" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <!-- Placeholder for staff image with gradient -->
            <div class="h-64 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <div class="text-white text-center">
                <svg class="h-20 w-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <p class="text-sm opacity-75">{{ member.name }}</p>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ member.name }}</h3>
              <p class="text-blue-600 font-medium">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-16 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-white">{{ t('about.stats.patients') }}</div>
            <div class="text-blue-200 mt-2">{{ t('about.stats.patientsLabel') }}</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-white">{{ t('about.stats.staff') }}</div>
            <div class="text-blue-200 mt-2">{{ t('about.stats.staffLabel') }}</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-white">{{ t('about.stats.years') }}</div>
            <div class="text-blue-200 mt-2">{{ t('about.stats.yearsLabel') }}</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-white">{{ t('about.stats.services') }}</div>
            <div class="text-blue-200 mt-2">{{ t('about.stats.servicesLabel') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call-to-Action Section -->
    <section class="bg-indigo-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">{{ t('about.contact.title') }}</h2>
        <p class="mt-4 text-lg leading-6 text-indigo-200">{{ t('about.contact.subtitle') }}</p>
        <button
            @click="navigateToBooking"
            class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition"
        >
          {{ t('about.contact.cta') }}
        </button>
      </div>
    </section>

    <Footer/>
  </Layout>
</template>