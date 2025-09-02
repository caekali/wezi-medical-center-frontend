import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token'))

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })

            const data = await response.json()

            if (response.ok) {
                user.value = data.user
                token.value = data.token
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                return { success: true, user: data.user }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            return { success: false, message: 'Login failed. Please try again.' }
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const initializeAuth = () => {
        const savedUser = localStorage.getItem('user')
        if (savedUser && token.value) {
            user.value = JSON.parse(savedUser)
        }
    }

    const isDoctor = () => {
        return user.value?.role === 'doctor'
    }

    const isAdmin = () => {
        return user.value?.role === 'admin'
    }

    return {
        user,
        token,
        login,
        logout,
        initializeAuth,
        isDoctor,
        isAdmin
    }
})