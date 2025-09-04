<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t, locale } = useI18n()
const showLanguageDropdown = ref(false)
const showAppointmentDropdown = ref(false)

const props = defineProps({
  isTransparent: {
    type: Boolean,
    default: false
  }
})

const navigationItems = computed(() => [
  { name: t('navigation.home'), href: '/', id: 'home', isRoute: true },
  { name: t('navigation.departments'), href: '/departments', id: 'departments', isRoute: true },
  {
    name: t('navigation.appointments'),
    href: '/book-appointment',
    id: 'appointments',
    isRoute: true,
    hasDropdown: true,
    dropdownItems: [
      { name: t('navigation.bookAppointment'), href: '/book-appointment', id: 'book-appointment' },
      { name: t('navigation.bookAmbulance'), href: '/book-ambulance', id: 'book-ambulance' }
    ]
  },
  { name: t('navigation.map'), href: '/map', id: 'map', isRoute: true },
  { name: t('navigation.about'), href: '/about', id: 'about', isRoute: true },
])

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' }
]

const currentLanguage = computed(() =>
    languages.find(lang => lang.code === locale.value) || languages[0]
)

const changeLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('locale', langCode)
  showLanguageDropdown.value = false
}

const isActiveLink = (href, isRoute) => {
  if (isRoute) {
    if (href === '/') {
      return route.path === '/'
    }
    return route.path === href
  }
  return route.hash === href || route.path.includes(href.replace('#', ''))
}

const isActiveDropdown = (dropdownItems) => {
  return dropdownItems.some(item => route.path === item.href)
}

const headerClasses = computed(() => {
  return props.isTransparent
      ? ''
      : 'bg-black/30 shadow-sm'
})

const logoClasses = computed(() => {
  return props.isTransparent
      ? 'text-white'
      : 'text-white'
})

const navLinkClasses = computed(() => {
  return props.isTransparent
      ? 'text-white hover:text-indigo-300'
      : 'text-white hover:text-indigo-600'
})

const loginButtonClasses = computed(() => {
  return props.isTransparent
      ? 'text-indigo-950 bg-white hover:bg-gray-100'
      : 'text-white bg-indigo-600 hover:bg-indigo-700'
})
</script>

<template>
  <header
      :class="headerClasses"
      class="flex items-center justify-between h-16  px-6 md:px-16 lg:px-24 xl:px-32 py-6 w-full transition-colors duration-300"
      role="banner"
  >
    <router-link
        to="/"
        :class="logoClasses"
        class="flex items-center font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded transition-colors"
    >
      <div class="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-2">
        <img src="../assets/logo.png" alt="Wezi Medical Center Logo" class="h-8 w-8 object-contain">
      </div>
      <span class="hidden sm:flex ml-2">Wezi Medical Center</span>
    </router-link>

    <nav
        class="hidden font-semibold md:flex items-center justify-center gap-8 text-sm"
        role="navigation"
        aria-label="Main navigation"
    >
      <template v-for="item in navigationItems" :key="item.id">
        <!-- Regular navigation items -->
        <router-link
            v-if="item.isRoute && !item.hasDropdown"
            :to="item.href"
            :class="[
            navLinkClasses,
            isActiveLink(item.href, item.isRoute) ? 'border text-indigo-50 font-semibold' : ''
          ]"
            class="transition focus:outline-none focus:ring-2 rounded px-2 py-1"
            :aria-current="isActiveLink(item.href, item.isRoute) ? 'page' : undefined"
        >
          {{ item.name }}
        </router-link>

        <!-- Dropdown navigation items -->
        <div
            v-else-if="item.hasDropdown"
            class="relative"
            @mouseenter="showAppointmentDropdown = true"
            @mouseleave="showAppointmentDropdown = false"
        >
          <button
              :class="[
              navLinkClasses,
              isActiveDropdown(item.dropdownItems) ? 'border text-indigo-50 font-semibold' : ''
            ]"
              class="flex items-center space-x-1 transition focus:outline-none focus:ring-2 rounded px-2 py-1"
          >
            <span>{{ item.name }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
              v-if="showAppointmentDropdown"
              class="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          >
            <router-link
                v-for="dropdownItem in item.dropdownItems"
                :key="dropdownItem.id"
                :to="dropdownItem.href"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                :class="{ 'bg-indigo-50 text-indigo-600': route.path === dropdownItem.href }"
            >
              {{ dropdownItem.name }}
            </router-link>
          </div>
        </div>

        <!-- Non-route items -->
        <a
            v-else-if="!item.isRoute"
            :href="item.href"
            :class="[
            navLinkClasses,
            isActiveLink(item.href, item.isRoute) ? 'text-indigo-500 font-semibold' : ''
          ]"
            class="transition focus:outline-none focus:ring-2 rounded px-2 py-1"
        >
          {{ item.name }}
        </a>
      </template>
    </nav>

    <div class="flex items-center space-x-4">
      <!-- Language Selector -->
      <div class="relative">
        <button
            @click="showLanguageDropdown = !showLanguageDropdown"
            :class="navLinkClasses"
            class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2"
            :aria-label="t('navigation.language')"
        >
          <span>{{ currentLanguage.flag }}</span>
          <span class="hidden md:inline">{{ currentLanguage.name }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Language Dropdown -->
        <div
            v-if="showLanguageDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            @click.stop
        >
          <button
              v-for="language in languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              :class="{ 'bg-indigo-50 text-indigo-600': locale === language.code }"
          >
            <span class="mr-3">{{ language.flag }}</span>
            <span>{{ language.name }}</span>
            <svg
                v-if="locale === language.code"
                class="ml-auto w-4 h-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="hidden md:flex space-x-4">
        <router-link
            :class="loginButtonClasses"
            class="px-5 py-2 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2"
            to="/login"
        >
          {{ t('navigation.login') }}
        </router-link>
      </div>
    </div>

    <!-- Click outside to close dropdowns -->
    <div
        v-if="showLanguageDropdown || showAppointmentDropdown"
        @click="showLanguageDropdown = false; showAppointmentDropdown = false"
        class="fixed inset-0 z-40"
    ></div>
  </header>
</template>