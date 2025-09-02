import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('auth_token'))

    const isAuthenticated = computed(() => !!token.value && !!user.value)

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })

            if (response.ok) {
                const data = await response.json()
                token.value = data.token
                user.value = data.user
                localStorage.setItem('auth_token', data.token)
                return true
            }
            return false
        } catch (error) {
            console.error('Login error:', error)
            return false
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('auth_token')
    }

    const fetchUser = async () => {
        if (!token.value) return false

        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                }
            })

            if (response.ok) {
                user.value = await response.json()
                return true
            } else {
                logout()
                return false
            }
        } catch (error) {
            logout()
            return false
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        fetchUser
    }
})