import { api } from "../lib/api";

export async function signup({ name, email, password }) {
  const { data } = await api.post("/user/register", { name, email, password });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/user/login", { email, password });
  return data; 
}

export async function getMe() {
  const { data } = await api.get("/user/me"); 
  return data; 
}

export async function logout() {
  const { data } = await api.post("/user/logout");
  return data;
}
