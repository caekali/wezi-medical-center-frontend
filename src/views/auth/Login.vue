<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../../components/Layout.vue'
import { useAuthStore } from '@/stores/auth'
import logoImage from '@/assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()

// --- Helpers ---
const redirectByRole = (role) => {
  const routes = {
    admin: '/dashboard',
    doctor: '/doctor/dashboard',
    'help desk': '/staff/dashboard', 
  }
  router.replace(routes[role] || '/')
}

// --- Auto redirect if already logged in ---
onMounted(() => {
  authStore.initializeAuth()
  if (authStore.user && authStore.token) {
    redirectByRole(authStore.user.role)
  }
})

// --- Form data ---
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false,
})

// --- State ---
const isSubmitting = ref(false)
const showPassword = ref(false)
const errors = ref({})

// --- Validation ---
const isValidEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)
)

const isFormValid = computed(() =>
  !!loginForm.value.email &&
  !!loginForm.value.password &&
  isValidEmail.value &&
  loginForm.value.password.length >= 6
)

// --- Clear error for a field ---
const clearError = (field) => {
  if (errors.value[field]) {
    errors.value = { ...errors.value, [field]: undefined }
  }
}

//  Submit login
const submitLogin = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  errors.value = {}

  try {
    const { success, user, message, errors: validationErrors } =
      await authStore.login({
        email: loginForm.value.email,
        password: loginForm.value.password,
        remember: loginForm.value.rememberMe,
      })

    if (success) {
      redirectByRole(user.role)
    } else {
      errors.value = validationErrors || { general: message }
    }
  } catch (err) {
    console.error(err)
    errors.value.general = 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Toggle password visibility ---
const togglePasswordVisibility = () =>
  (showPassword.value = !showPassword.value)
</script>


<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo and Title -->
        <div class="text-center">
          <router-link to="/" class="inline-flex items-center">
            <div class="h-12 w-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img :src="logoImage" alt="">
            </div>
          </router-link>

          <h2 class="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <!-- General Error Message -->
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

          <form @submit.prevent="submitLogin" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address *
              </label>
              <div class="mt-1 relative">
                <input id="email" v-model="loginForm.email" @input="clearError('email')" type="email"
                  autocomplete="email" required :class="[
                    'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition',
                    errors.email ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
                  ]" placeholder="Enter your email" />
                <div v-if="errors.email" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div class="mt-1 relative">
                <input id="password" v-model="loginForm.password" @input="clearError('password')"
                  :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required :class="[
                    'appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition',
                    errors.password ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
                  ]" placeholder="Enter your password" />
                <button type="button" @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12m-3.878-2.122L4.929 5.765m0 0L2.22 3.057m2.71 2.708L12 12" />
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <!-- Remember Me and Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" v-model="loginForm.rememberMe" type="checkbox"
                  class="h-4 w-4 text-indigo-950 focus:ring-indigo-950 border-gray-300 rounded" />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <router-link to="/forgot-password" class="font-medium text-indigo-950 hover:text-indigo-900 transition">
                  Forgot your password?
                </router-link>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button type="submit" :disabled="!isFormValid || isSubmitting"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                <span v-if="isSubmitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Signing in...
                </span>
                <span v-else>Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="mt-8 text-center">
        <router-link to="/" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to homepage
        </router-link>
      </div>
    </div>
  </Layout>
</template>