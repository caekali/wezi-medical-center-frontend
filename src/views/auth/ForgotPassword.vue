<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../../components/Layout.vue'
import { forgotPassword } from '@/services/authService'

const router = useRouter()

const forgotForm = ref({
  email: ''
})

const isSubmitting = ref(false)
const errors = ref({})
const successMessage = ref('')

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const submitForgotPassword = async () => {
  if (!forgotForm.value.email) {
    errors.value.email = "Email is required"
    return
  }

  isSubmitting.value = true
  errors.value = {}
  successMessage.value = ''

  try {
    const { success, errors: validationErrors, message } = await forgotPassword(forgotForm.value.email)

    if (success) {
      successMessage.value = "Password reset link sent to your email."
    } else {
      if (validationErrors) {
        errors.value = validationErrors
      } else {
        errors.value.general = message
      }
    }
  } catch (err) {
    errors.value.general = "Something went wrong. Please try again."
  } finally {
    isSubmitting.value = false
  }
}
</script>



<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo and Title -->
        <div class="text-center">
          <router-link to="/" class="inline-flex items-center">
            <div class="h-12 w-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img src="../assets/logo.png" alt="">
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

          <form @submit.prevent="submitForgotPassword" class="space-y-6">
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