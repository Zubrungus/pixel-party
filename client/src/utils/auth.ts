import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "id_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export interface DecodedToken {
  exp: number;
  userId: string;
  username: string;
}

export const getUser = (): { userId: string; username: string } | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      userId: decoded.userId,
      username: decoded.username
    };
  } catch (err) {
    removeToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();

  if (!token) {
    removeToken(); // No token, remove it
    return false;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
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
