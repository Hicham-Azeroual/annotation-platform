import axios from "./axiosConfig";

export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials);
  return response.data;
};
export const forgotPassword = async (email) => {
  const response = await axios.post("/auth/forgot-password", { email });
  return response.data;
};
