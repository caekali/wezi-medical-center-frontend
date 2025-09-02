
import api from "@/plugins/axios";

export const login = async (credentials) => {
    try {

        await fetch('/sanctum/csrf-cookie')

        const response = await api.post("/auth/login", credentials);

        if (response.data.token) {
            localStorage.setItem("auth_token", response.data.token);
        }

        return { success: true, data: response.data };
    } catch (error) {
        if (error.response?.data?.errors) {
            return { success: false, errors: error.response.data.errors };
        }
        return {
            success: false,
            message: error.response?.data?.error || "Login failed",
        };
    }
};

export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (e) {

    } finally {
        localStorage.removeItem("auth_token");
    }
};
