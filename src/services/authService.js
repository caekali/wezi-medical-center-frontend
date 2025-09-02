import api from "@/plugins/axios";

// Login
export const login = async (credentials) => {
  try {
    await fetch('/sanctum/csrf-cookie', { credentials: "include" });

    const response = await api.post("/auth/login", credentials, {
      withCredentials: true,
    });

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

// Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
  } catch (e) {
    // optional: handle logout error
  } finally {
    localStorage.removeItem("auth_token");
  }
};

// Forgot Password (request password reset link)
export const forgotPassword = async (email) => {
  try {
    await fetch('/sanctum/csrf-cookie', { credentials: "include" });

    const response = await api.post("/auth/forgot-password", { email }, {
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.data?.errors) {
      return { success: false, errors: error.response.data.errors };
    }
    return {
      success: false,
      message: error.response?.data?.error || "Failed to send reset link",
    };
  }
};

// Reset Password (submit new password with token)
export const resetPassword = async (data) => {
  // data should include: email, token, password, password_confirmation
  try {
    await fetch('/sanctum/csrf-cookie', { credentials: "include" });

    const response = await api.post("/auth/reset-password", data, {
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.data?.errors) {
      return { success: false, errors: error.response.data.errors };
    }
    return {
      success: false,
      message: error.response?.data?.error || "Password reset failed",
    };
  }
};
