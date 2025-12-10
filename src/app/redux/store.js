import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "../store/authSlice";
import adminAuthReducer from "./slices/adminAuthSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
  },
});
