<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'

const { t } = useI18n()
const isPlaying = ref(true);
const currentSlide = ref(0);
const isSubmitting = ref(false);

// Appointment form data
const appointmentForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  preferredDate: '',
  preferredTime: '',
  reason: ''
});

// Computed property for minimum date (today)
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Slideshow functionality
let slideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 5;
  updateSlider();
};

const goToSlide = (index) => {
  currentSlide.value = index;
  updateSlider();
};

const updateSlider = () => {
  const slider = document.getElementById('background-slider');
  if (slider) {
    slider.style.transform = `translateX(-${currentSlide.value * 100}%)`;
  }
};

const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    startSlideshow();
  } else {
    stopSlideshow();
  }
};

const startSlideshow = () => {
  slideInterval = setInterval(nextSlide, 5000);
};

const stopSlideshow = () => {
  clearInterval(slideInterval);
};

// Submit appointment function
const submitAppointment = async () => {
  isSubmitting.value = true;

  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(appointmentForm.value)
    });

    if (response.ok) {
      // Reset form
      appointmentForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        preferredDate: '',
        preferredTime: '',
        reason: ''
      };
      alert('Appointment request submitted successfully! We will contact you soon to confirm.');
    } else {
      throw new Error('Failed to submit appointment');
    }
  } catch (error) {
    console.error('Error submitting appointment:', error);
    alert('There was an error submitting your appointment. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  startSlideshow();

  // Add click listeners for slide indicators
  document.querySelectorAll('[data-slide-btn]').forEach((btn, index) => {
    btn.addEventListener('click', () => goToSlide(index));
  });
});
</script>

<template>
  <section id="hero-section" class="relative h-screen overflow-hidden" role="banner">
    <!-- Live Region for Screen Readers -->
    <div id="slide-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>

    <!-- Background Gallery Slider -->
    <div class="absolute inset-0 w-full h-full" role="img" aria-label="Medical facility slideshow">
      <div class="flex transition-transform duration-1000 ease-in-out h-full" id="background-slider" aria-live="off">
        <div class="w-full h-full flex-shrink-0 relative">
          <img src="../assets/images/hero_1.jpg"
               class="w-full h-full object-cover"
               alt="Modern medical facility exterior with professional staff"
               loading="eager">
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <div class="w-full h-full flex-shrink-0 relative">
          <img src="../assets/images/hero_2.jpg"
               class="w-full h-full object-cover"
               alt="Medical professionals providing patient care"
               loading="lazy">
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <div class="w-full h-full flex-shrink-0 relative">
          <img src="../assets/images/hero_5.jpg"
               class="w-full h-full object-cover"
               alt="Medical professionals providing patient care"
               loading="lazy">
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <div class="w-full h-full flex-shrink-0 relative">
          <img src="../assets/images/hero_4.jpg"
               class="w-full h-full object-cover"
               alt="Comfortable patient waiting and consultation areas"
               loading="lazy">
          <div class="absolute inset-0 bg-black/65"></div>
        </div>
        <div class="w-full h-full flex-shrink-0 relative">
          <img src="../assets/images/hero_3.jpg"
               class="w-full h-full object-cover"
               alt="Expert medical team in consultation"
               loading="lazy">
          <div class="absolute inset-0 bg-black/65"></div>
        </div>
      </div>
    </div>

    <div class="relative z-10 flex flex-col h-screen">
      <!-- Header with transparent navigation -->
      <div class="absolute top-0 left-0 right-0 z-20">
        <Navigation :is-transparent="true" />
        <Layout :show-skip-link="false" />
      </div>

      <main class="flex-1 flex flex-col md:flex-row items-center max-md:text-center justify-center px-6 sm:px-10 md:px-24 max-w-7xl mx-auto w-full" role="main">
        <div class="flex flex-col items-center md:items-start text-white">
          <h1 class="text-white mt-20 font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl leading-tight text-center md:text-left">
            <span class="text-indigo-200">{{ t('home.title') }}</span>
          </h1>

          <p class="mt-6 text-white/90 max-w-xl text-base sm:text-lg leading-relaxed text-center md:text-left">
            {{ t('home.subtitle') }}
          </p>

          <div class="flex flex-col md:flex-row items-center mt-8 gap-4">
            <router-link
                to="/book-appointment"
                class="z-50 bg-indigo-950 text-white px-8 pr-3 py-3 rounded-full text-sm font-medium flex items-center space-x-3 hover:bg-indigo-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                :aria-label="t('home.bookAppointment')"
                role="button"
            >
              {{ t('home.bookAppointment') }}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4.017 9.999h11.191m0 0-5.595-5.596m5.595 5.596-5.595 5.596" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </router-link>
          </div>
        </div>
      </main>

      <!-- Slideshow Controls -->
      <div class="z-50 flex items-center justify-center pb-8 space-x-6">
        <!-- Play/Pause Button -->
        <button @click="togglePlayPause"
                class="text-white hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
                :aria-label="isPlaying ? 'Pause slideshow' : 'Play slideshow'">
          <svg v-if="isPlaying" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7z" fill="currentColor"/>
          </svg>
        </button>

        <!-- Dot Indicators -->
        <div class="z-50 flex items-center space-x-3" role="tablist" aria-label="Slideshow navigation">
          <button v-for="(slide, index) in 5" :key="index"
                  :data-slide-btn="index"
                  class="w-3 h-3 bg-white/50 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                  :class="{ 'bg-white ring-2 ring-white': index === currentSlide }"
                  :aria-label="`Go to slide ${index + 1}`"
                  :aria-pressed="index === currentSlide ? 'true' : 'false'"
                  role="tab"
                  :aria-selected="index === currentSlide ? 'true' : 'false'">
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .transition-transform {
    transition: none;
  }
}
</style>