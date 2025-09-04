<script setup>
import { ref, computed } from 'vue'
import Layout from '../components/Layout.vue'
import Navigation from '@/components/Navigation.vue'
import pediatricsImage from '@/assets/images/Departments/pediatrics.jpg'
import dentalImage from '@/assets/images/Departments/dental.jpg'
import antenatalImage from '@/assets/images/Departments/antenatal.jpg'
import generalImage from '@/assets/images/Departments/general.jpg'
import heroImage from '@/assets/images/services.jpg'
import { useI18n } from 'vue-i18n'
import Footer from "@/components/Footer.vue";

const { t } = useI18n()

const departments = computed(() => [
  {
    id: 'general',
    name: t('departments.departmentsList.general.name'),
    description: t('departments.departmentsList.general.description'),
    image: generalImage,
    services: t('departments.departmentsList.general.services'),
    icon: '🏥'
  },
  {
    id: 'dental_care',
    name: t('departments.departmentsList.dental_care.name'),
    description: t('departments.departmentsList.dental_care.description'),
    image: dentalImage,
    services: t('departments.departmentsList.dental_care.services'),
    icon: '🦷'
  },
  {
    id: 'radiology',
    name: t('departments.departmentsList.radiology.name'),
    description: t('departments.departmentsList.radiology.description'),
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    services: t('departments.departmentsList.radiology.services'),
    icon: '🩻'
  },
  {
    id: 'pediatrics',
    name: t('departments.departmentsList.pediatrics.name'),
    description: t('departments.departmentsList.pediatrics.description'),
    image: pediatricsImage,
    services: t('departments.departmentsList.pediatrics.services'),
    icon: '👶'
  },
  {
    id: 'antenatal',
    name: t('departments.departmentsList.antenatal.name'),
    description: t('departments.departmentsList.antenatal.description'),
    image: antenatalImage,
    services: t('departments.departmentsList.antenatal.services'),
    icon: '🤰'
  },
  {
    id: 'emergency',
    name: t('departments.departmentsList.emergency.name'),
    description: t('departments.departmentsList.emergency.description'),
    image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    services: t('departments.departmentsList.emergency.services'),
    icon: '🚑'
  }
])
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
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('departments.title') }}</h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">{{ t('departments.subtitle') }}</p>
      </div>
    </div>
  </div>

  <Layout>

      <!-- Departments Grid -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 md:px-24">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
                v-for="department in departments"
                :key="department.id"
                class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <!-- Department Image -->
              <div class="relative h-48 overflow-hidden">
                <img
                    :src="department.image"
                    :alt="`${department.name} department`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div class="absolute top-4 left-4">
                  <span class="text-3xl bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                    {{ department.icon }}
                  </span>
                </div>
              </div>

              <!-- Department Content -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">
                  {{ department.name }}
                </h3>
                <p class="text-gray-600 mb-4 leading-relaxed">
                  {{ department.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-indigo-600 py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 md:px-24 text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
            {{ t('departments.ctaTitle') }}
          </h2>
          <p class="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            {{ t('departments.ctaSubtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
                to="/book-appointment"
                class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              {{ t('home.bookAppointment') }}
            </router-link>
            <a
                href="tel:+0996817322"
                class="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              {{ t('departments.emergency') }}
            </a>
          </div>
        </div>
      </section>
    <Footer/>
  </Layout>
</template>