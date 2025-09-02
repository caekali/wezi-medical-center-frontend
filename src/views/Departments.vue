<script setup>
import { ref } from 'vue'
import Layout from '../components/Layout.vue'
import Navigation from '@/components/Navigation.vue'
import pediatricsImage from '@/assets/images/Departments/pediatrics.jpg'
import dentalImage from '@/assets/images/Departments/dental.jpg'
import antenatalImage from '@/assets/images/Departments/antenatal.jpg'
import generalImage from '@/assets/images/Departments/general.jpg'

const departments = ref([
  {
    id: 'general',
    name: 'General Medicine',
    description: 'Comprehensive primary healthcare services for patients of all ages.',
    image: generalImage,
    services: [
      'Annual Health Checkups',
      'Preventive Care',
      'Chronic Disease Management',
      'Health Screenings',
      'Vaccinations'
    ],
    icon: '🏥'
  },
  {
    id: 'dental_care',
    name: 'Dental Care',
    description: 'Keeping your teeth, gums and mouth healthy.',
    image: dentalImage,
    services: [
      'Dental Consultation',
      'Scale and Polish (Cleaning)',
      'Extractions',
      'Fillings',
    ],
    icon: '🦷'
  },
  {
    id: 'radiology',
    name: 'Radiology',
    description: 'Advanced medical imaging and diagnostic services.',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    services: [
      'CT Scan',
      'Digital X-Ray',
      'High-end Ultrasonic',
      'Special Radiology Examinations',
    ],
    icon: '🩻'
  },{
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Specialized healthcare for infants, children, and adolescents.',
    image: pediatricsImage,
    services: [
      'Well-Child Visits',
      'Immunizations',
      'Growth Monitoring',
      'Developmental Assessments',
      'Pediatric Urgent Care'
    ],
    icon: '👶'
  },
  {
    id: 'antenatal',
    name: 'Antenatal Care',
    description: 'Comprehensive prenatal care and monitoring for expecting mothers and their babies throughout pregnancy.',
    image: antenatalImage,
    services: [
      'Prenatal Checkups',
      'Ultrasound Scans',
      'Pregnancy Monitoring',
      'Nutritional Counseling',
      'Birth Planning'
    ],
    icon: '🤰'
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    description: '24/7 emergency medical services with rapid response capabilities.',
    image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    services: [
      'Trauma Care',
      'Critical Care',
      'Emergency Surgery',
      'Rapid Diagnostics',
      'Ambulance Services'
    ],
    icon: '🚑'
  }
])
</script>

<template>
  <Layout>
    <Navigation />
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <section class="bg-white py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 md:px-24 text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span class="text-indigo-600">Departments</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive healthcare services across multiple specialties,
            providing expert care with state-of-the-art technology and compassionate professionals.
          </p>
        </div>
      </section>

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

                <!-- Services List -->
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Key Services
                  </h4>
                  <ul class="space-y-2">
                    <li
                      v-for="service in department.services"
                      :key="service"
                      class="flex items-center text-sm text-gray-600"
                    >
                      <svg class="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {{ service }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-indigo-600 py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 md:px-24 text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
            Need Medical Assistance?
          </h2>
          <p class="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Our medical professionals are ready to provide you with the best care possible.
            Book an appointment today.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/"
              class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              Book Appointment
            </router-link>
            <a
              href="tel:+1234567890"
              class="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              Emergency: 0996 817 322
            </a>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>