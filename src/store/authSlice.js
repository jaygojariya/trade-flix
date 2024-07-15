import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    roles: [],
    auth: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.roles = action.payload.roles;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.roles = [];
    },
    profileLogin: (state, action) => {
      state.auth = action.payload.auth;
    },
  },
});
export const getAuth = (state) => state?.auth;

export const { login, logout, profileLogin } = authSlice.actions;
export default authSlice.reducer;
