<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  isTransparent: {
    type: Boolean,
    default: false
  }
})

const navigationItems = [
  { name: 'Home', href: '/', id: 'home', isRoute: true },
  { name: 'Departments', href: '/departments', id: 'departments', isRoute: true },
  { name: 'Appointments', href: '#book-appointment', id: 'appointments', isRoute: false },
  { name: 'Map', href: '#map', id: 'map', isRoute: false },
  { name: 'Chat with Us', href: '#map', id: 'chat', isRoute: false },
]

const isActiveLink = (href, isRoute) => {
  if (isRoute) {
    if (href === '/') {
      return route.path === '/'
    }
    return route.path === href
  }
  return route.hash === href || route.path.includes(href.replace('#', ''))
}

const headerClasses = computed(() => {
  return props.isTransparent
    ? ''
    : 'bg-white shadow-sm'
})

const logoClasses = computed(() => {
  return props.isTransparent
    ? 'text-white'
    : 'text-gray-900'
})

const navLinkClasses = computed(() => {
  return props.isTransparent
    ? 'text-white hover:text-indigo-300'
    : 'text-gray-700 hover:text-indigo-600'
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
    class="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-6 w-full transition-colors duration-300"
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
        <router-link
          v-if="item.isRoute"
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
        <a
          v-else
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
      <div class="hidden md:flex space-x-4">
        <router-link
          :class="loginButtonClasses"
          class="px-5 py-2 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2"
         to="login">
          Login
        </router-link>
      </div>
    </div>
  </header>
</template>