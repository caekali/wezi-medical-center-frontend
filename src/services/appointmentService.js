import api from '@/plugins/axios'

const API_URL = '/appointments'

// Fetch all appointments
export const getAppointments = async () => {
    try {
        const response = await api.get(API_URL)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch appointments',
        }
    }
}
export const getAppointmentsForDoctor = async (id) => {
    try {
        const response = await api.get(API_URL, {
            params: { doctor: id }
        })
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch appointments',
        }
    }
}


// Fetch a single appointment
export const getAppointmentById = async (id) => {
    try {
        const response = await api.get(`${API_URL}/${id}`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch appointment',
        }
    }
}

// Create a new appointment
export const createAppointment = async (appointmentData) => {
    try {
        const response = await api.post(API_URL, appointmentData)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create appointment',
            errors: error.response?.data?.errors || null
        }
    }
}

export const updateAppointment = async (id, appointmentData) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, appointmentData)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update appointment',
            errors: error.response?.data?.errors || null
        }
    }
}

// Delete an appointment
export const deleteAppointmentById = async (id) => {
    try {
        await api.delete(`${API_URL}/${id}`)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete appointment',
        }
    }
}