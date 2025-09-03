import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('auth_token') || null)

    const isLoggedIn = computed(() => !!token.value)
    const isDoctor = computed(() => user.value?.role === 'doctor')
    const isAdmin = computed(() => user.value?.role === 'admin')

    const login = async (credentials) => {
        const { success, data, errors, message } = await loginService(credentials)

        if (success) {
            user.value = data.user
            token.value = data.token
            localStorage.setItem('auth_token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            return { success: true, user: data.user }
        } else {
            return { success: false, message, errors }
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
    }

    const initializeAuth = () => {
        const savedUser = localStorage.getItem('user')
        const savedToken = localStorage.getItem('auth_token')
        if (savedUser && savedToken) {
            user.value = JSON.parse(savedUser)
            token.value = savedToken
        }
    }

    return { user, token, isLoggedIn, login, logout, initializeAuth, isDoctor, isAdmin }
})
