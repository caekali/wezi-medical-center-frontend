import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('auth_token') || null)
    const profileId = ref(localStorage.getItem('profile_id') || null)

    const isLoggedIn = computed(() => !!token.value)
    const isDoctor = computed(() => user.value?.role === 'doctor')
    const isAdmin = computed(() => user.value?.role === 'admin')
    const isHelpDesk = computed(() => user.value?.role === 'help desk')

    const login = async (credentials) => {
        const { success, data, errors, message } = await loginService(credentials)

        if (success) {
            user.value = data.user
            token.value = data.token
            profileId.value = data.profile_id || null

            localStorage.setItem('auth_token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('profile_id', profileId.value)

            return { success: true, user: data.user }
        } else {
            return { success: false, message, errors }
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        profileId.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        localStorage.removeItem('profile_id')
    }

    const initializeAuth = () => {
        const savedUser = localStorage.getItem('user')
        const savedToken = localStorage.getItem('auth_token')
        const savedProfileId = localStorage.getItem('profile_id')
        if (savedUser && savedToken) {
            user.value = JSON.parse(savedUser)
            token.value = savedToken
            profileId.value = savedProfileId
        }
    }

    return {
        user,
        token,
        profileId,
        isLoggedIn,
        login,
        logout,
        initializeAuth,
        isDoctor,
        isAdmin,
        isHelpDesk
    }
})
