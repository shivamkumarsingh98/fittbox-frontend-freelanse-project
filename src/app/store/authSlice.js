import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage if available
const getInitialState = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    try {
      console.debug("[authSlice] getInitialState - token present:", !!token);
    } catch (e) {}
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isAuthenticated: !!token,
      loading: false,
    };
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  };
};

const initialState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        try {
          console.debug("[authSlice] setAuth - token saved:", !!token);
        } catch (e) {}
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setAuth, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;
