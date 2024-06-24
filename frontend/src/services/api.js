import axios from "axios";

export async function Signup(formData) {
  try {
    const { data } = await axios.post("/api/auth/signup", formData);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function Login(formData) {
  try {
    const { data } = await axios.post("/api/auth/login", formData);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function Logout() {
  try {
    const { data } = await axios.post("/api/auth/logout");
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function Suggested() {
  try {
    const { data } = await axios.get("/api/users/suggested");
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getMyProfile() {
  try {
    const { data } = await axios.get("/api/auth/me");
    if (data.error) return null;
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function Follow(id) {
  try {
    const { data } = await axios.post(`/api/users/follow/${id}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFollowing() {
  try {
    const { data } = await axios.get(`/api/posts/following`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
