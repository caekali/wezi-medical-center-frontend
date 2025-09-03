import api from '@/plugins/axios'

// Fetch all departments
export const getDepartments = async () => {
  try {
    const response = await api.get('/departments')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch departments',
    }
  }
}

// Fetch a single department
export const getDepartment = async (id) => {
  try {
    const response = await api.get(`/departments/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch department',
    }
  }
}

// Create a department
export const createDepartment = async (department) => {
  try {
    const response = await api.post('/departments', department)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create department',
      errors: error.response?.data?.errors || null
    }
  }
}

// Update a department
export const updateDepartment = async (id, department) => {
  try {
    const response = await api.put(`/departments/${id}`, department)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update department',
      errors: error.response?.data?.errors || null
    }
  }
}

// Delete a department
export const deleteDepartmentById = async (id) => {
  try {
    await api.delete(`/departments/${id}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete department',
    }
  }
}
