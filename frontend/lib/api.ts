import { LoginRequest, RegisterRequest } from '@/types/auth';
import { ResponseMessage } from "@/types/ResponseMessage";

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Helper function for making authenticated requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // This is important for sending/receiving cookies
  });


  // Handle 401 Unauthorized
  if (response.status === 401) {
    // You might want to redirect to login or refresh token here
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

export const registerUser = async (data: RegisterRequest): Promise<ResponseMessage> => {
  try {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Note: loginUser is now handled directly in the login action
// to properly handle the HTTP-only cookie

export const logoutUser = async (): Promise<{ success: boolean }> => {
  try {
    const response = await fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
    return { success: response.ok };
  } catch (error) {
    console.error('Logout failed:', error);
    return { success: false };
  }
};

// Example of a protected API call
export const fetchProtectedData = async (): Promise<any> => {
  const response = await fetchWithAuth('/protected-route');
  return response.json();
};
