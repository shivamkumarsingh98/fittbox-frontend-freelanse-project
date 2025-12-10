import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${api}/api/users/register`, userData);
    return response.data; // expect backend to include message/user fields
  } catch (error) {
    // Prefer backend field errors if available
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${api}/api/users/login`, credentials);
    return response.data; // expect backend message/user/token
  } catch (error) {
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};

export const fetchUserProfile = async (token) => {
  try {
    const response = await axios.get(`${api}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};

export const updateUserProfile = async (token, payload) => {
  try {
    const response = await axios.put(`${api}/api/users/profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};

export const changeUserPassword = async (token, payload) => {
  try {
    // If backend exposes a dedicated endpoint, adjust here accordingly
    const response = await axios.put(`${api}/api/users/change-password`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const fieldErrors = error?.response?.data?.errors;
    const message =
      fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length
        ? fieldErrors
            .map((e) => e?.msg || "")
            .filter(Boolean)
            .join("\n")
        : error?.response?.data?.message || error?.message;
    throw new Error(message);
  }
};
