import api from '@/plugins/axios'

// Fetch a doctors by department
export const getDoctorByDepartment = async (id) => {
    try {
        const response = await api.get(`/departments/${id}/doctors`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch department',
        }
    }
}

export const getDoctorAvailabilities = async (doctorId) => {
    try {
        const response = await api.get(`/doctors/${doctorId}/availabilities`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch availabilities',
        }
    }
}

export const createDoctorAvailability = async (availability) => {
    try {
        const response = await api.post(`/doctors/${availability.doctor_id}/availabilities`, availability)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create availability',
        }
    }
}


export const updateDoctorAvailability = async (availabilityId, payload) => {
    try {
        const response = await api.put(`/availabilities/${availabilityId}`, payload)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update availability',
        }
    }
}


export const deleteDoctorAvailability = async (availabilityId) => {
    try {
        await api.delete(`/availabilities/${availabilityId}`)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete availability',
        }
    }
}

