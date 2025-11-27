import { RegisterRequest } from '@/types/auth';
import { ResponseMessage } from "@/types/ResponseMessage";
import { toast } from 'react-hot-toast';
import {Stock} from "@/types/Stock";

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

export const logoutUser = async (): Promise<{ success: boolean }> => {
  try {
    const response = await fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
    
    if (response.ok) {
      toast.success('Successfully logged out');
    } else {
      throw new Error('Logout failed');
    }
    
    return { success: response.ok };
  } catch (error) {
    console.error('Logout failed:', error);
    toast.error('Failed to log out. Please try again.');
    return { success: false };
  }
};


// In lib/api.ts
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}


export const fetchStocks = async (page: number = 0, size: number = 5): Promise<PaginatedResponse<Stock>> => {
  try {
    const response = await fetchWithAuth(`/stock?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stocks');
    }
    const data = await response.json();
    return data.data; // Assuming the response has a data property with the paginated result
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};