import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "id_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = getToken();

  if (!token) {
    removeToken(); // No token, remove it
    return false;
  }

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (decoded.exp * 1000 < Date.now()) {
      removeToken(); // Expired, remove it
      return false;
    }
    return true;
  } catch (err) {
    removeToken(); // Invalid token, remove it
    console.error(err);
    return false;
  }
};
