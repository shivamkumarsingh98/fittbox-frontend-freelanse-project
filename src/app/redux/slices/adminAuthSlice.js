import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("admin");
    return {
      admin: admin ? JSON.parse(admin) : null,
      token: token || null,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    };
  }
  return {
    admin: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const initialState = getInitialState();

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminAuth: (state, action) => {
      const { admin, token } = action.payload;
      state.admin = admin || null;
      state.token = token || null;
      state.isAuthenticated = !!token;
      state.error = null;

      if (typeof window !== "undefined") {
        if (token) localStorage.setItem("adminToken", token);
        if (admin) localStorage.setItem("admin", JSON.stringify(admin));
      }
    },
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdminError: (state, action) => {
      state.error = action.payload;
    },
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
      }
    },
  },
});

export const { setAdminAuth, setAdminLoading, setAdminError, adminLogout } =
  adminAuthSlice.actions;

export default adminAuthSlice.reducer;
