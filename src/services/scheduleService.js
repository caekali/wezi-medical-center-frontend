
import api from "@/plugins/axios";

export const getDoctorSchedule = async (doctorId, date) => {
    try {
        const response = await api.get(`/doctors/${doctorId}/schedule`, {
            params: { date }
        })
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch doctor schedule'
        }
    }
}

export const getDoctorAvailableSlots = async (doctorId, date) => {
    try {
        const response = await api.get(`/doctors/${doctorId}/available-slots`, {
            params: { date }
        })
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch available slots'
        }
    }
}