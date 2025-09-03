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