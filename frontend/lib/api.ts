import {RegisterRequest} from '@/types/auth';
import {ResponseMessage} from "@/types/ResponseMessage";
import {toast} from 'react-hot-toast';
import {Stock} from "@/types/Stock";
import {StockExchange} from "@/types/Stock";

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
			toast.success('Successfully logged out', {duration: 2000});
		} else {
			throw new Error('Logout failed');
		}

		return {success: response.ok};
	} catch (error) {
		console.error('Logout failed:', error);
		toast.error('Failed to log out. Please try again.');
		return {success: false};
	}
};


export interface PaginatedResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}


export const fetchStocks = async (page: number = 0, size: number = 5):
	Promise<PaginatedResponse<Stock>> => {
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

export interface CreateStockRequest {
	name: string
	description: string
	currentPrice: number
}

export interface CreateStockExchangeRequest {
	name: string;
	description: string;
}

// Update your existing createStock function in api.ts
export async function createStock(stock: CreateStockRequest): Promise<Stock> {

	const response = await fetchWithAuth('/stock', {
		method: 'POST',
		body: JSON.stringify(stock),
	});

	const responseData = await response.json();


	if (!response.ok) {

		// Check if it's a validation error from Spring Boot
		if (response.status === 400 && responseData.errors) {
			throw {
				response: {
					data: {
						errors: responseData.errors,
						message: responseData.message || 'Validation failed'
					},
					status: response.status
				}
			};
		}

		throw {
			response: {
				data: responseData,
				status: response.status
			}
		};
	}

	return responseData.data;
}

export async function deleteStock(stockId: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`/stock/${stockId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete stock');
    }
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
}

export async function fetchStockExchanges(page: number = 0, size: number = 5): Promise<PaginatedResponse<StockExchange>> {
	try {
		const response = await fetchWithAuth(`/stockExchange?page=${page}&size=${size}`);
		if (!response.ok) {
			throw new Error('Failed to fetch stock exchanges');
		}
		const responseData = await response.json()
		return responseData.data;
	} catch (error) {
		console.error('Error fetching stock exchanges:', error);
		throw error;
	}
}

export interface UpdateStockExchangeRequest {
  name: string;
  description: string;
  liveInMarket: boolean;
}

export async function updateStockExchange(id: string, exchange: UpdateStockExchangeRequest): Promise<StockExchange> {

	console.log(exchange)
  const response = await fetchWithAuth(`/stockExchange/${id}`, {
    method: 'PUT',
    body: JSON.stringify(exchange),
  });

  const responseData = await response.json();
	console.log(responseData)

  if (!response.ok) {
    if (response.status === 400 && responseData.errors) {
      throw {
        response: {
          data: {
            errors: responseData.errors,
            message: responseData.message || 'Validation failed'
          },
          status: response.status
        }
      };
    }

    throw {
      response: {
        data: responseData,
        status: response.status
      }
    };
  }

  return responseData.data;
}

export async function createStockExchange(exchange: CreateStockExchangeRequest): Promise<StockExchange> {
	const response = await fetchWithAuth('/stockExchange', {
		method: 'POST',
		body: JSON.stringify(exchange),
	});

	const responseData = await response.json();

	if (!response.ok) {
		if (response.status === 400 && responseData.errors) {
			throw {
				response: {
					data: {
						errors: responseData.errors,
						message: responseData.message || 'Validation failed'
					},
					status: response.status
				}
			};
		}

		throw {
			response: {
				data: responseData,
				status: response.status
			}
		};
	}

	return responseData.data;
}

export interface UpdateStockRequest {
	currentPrice: number;
}

export async function updateStock(id: string, stock: UpdateStockRequest): Promise<Stock> {
	const response = await fetchWithAuth(`/stock/${id}/price`, {
		method: 'PUT',
		body: JSON.stringify({
			...stock,
			currentPrice: Number(stock.currentPrice) // Ensure it's a number
		}),
	});

	const responseData = await response.json();

	if (!response.ok) {
		if (response.status === 400 && responseData.errors) {
			throw {
				response: {
					data: {
						errors: responseData.errors,
						message: responseData.message || 'Validation failed'
					},
					status: response.status
				}
			};
		}

		throw {
			response: {
				data: responseData,
				status: response.status
			}
		};
	}

	return responseData.data;
}