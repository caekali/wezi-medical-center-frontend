import api from '@/plugins/axios'
const basePath = '/departments'


// get all services
export const getServices = async () => {
    try {
        const response = await api.get(`/services`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch services',
        }
    }
}

// Fetch all services for a department
export const getDepartmentServices = async (departmentId) => {
    try {
        const response = await api.get(`${basePath}/${departmentId}/services`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch services',
        }
    }
}

// Fetch a single service for a department
export const getDepartmentService = async (departmentId, serviceId) => {
    try {
        const response = await api.get(`${basePath}/${departmentId}/services/${serviceId}`)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch service',
        }
    }
}

// Create a service for a department
export const createDepartmentService = async (departmentId, service) => {
    try {
        const response = await api.post(`${basePath}/${departmentId}/services`, service)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create service',
            errors: error.response?.data?.errors || null
        }
    }
}

// Update a service for a department
export const updateDepartmentService = async (departmentId, serviceId, service) => {
    try {
        const response = await api.put(`${basePath}/${departmentId}/services/${serviceId}`, service)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update service',
            errors: error.response?.data?.errors || null
        }
    }
}

// Delete a service from a department
export const deleteDepartmentService = async (departmentId, serviceId) => {
    try {
        await api.delete(`${basePath}/${departmentId}/services/${serviceId}`)
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete service',
        }
    }
}