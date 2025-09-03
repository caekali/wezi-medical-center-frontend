import api from '@/plugins/axios'
const basePath = '/users'

// Get all users
export const getUsers = async () => {
    try {
        const response = await api.get(basePath)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch users',
        }
    }
}

// Get a single user
export const getUser = async (userId) => {
    try {
        const response = await api.get(`${basePath}/${userId}`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch user',
        }
    }
}

// Create a new user
export const createUser = async (user) => {
    try {
        const response = await api.post(basePath, user)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create user',
            errors: error.response?.data?.errors || null,
        }
    }
}

// Update a user
export const updateUser = async (userId, user) => {
    try {
        const response = await api.put(`${basePath}/${userId}`, user)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update user',
            errors: error.response?.data?.errors || null,
        }
    }
}

// Delete a user
export const deleteUser = async (userId) => {
    try {
        await api.delete(`${basePath}/${userId}`)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete user',
        }
    }
}
