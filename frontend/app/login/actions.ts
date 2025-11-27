'use server';

import {LoginRequest} from '@/types/auth';
import {ResponseMessage} from "@/types/ResponseMessage";

export async function loginAction(data: LoginRequest): Promise<ResponseMessage> {
	try {
		const response = await fetch('http://localhost:8080/api/v1/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			credentials: 'include', // This is required for cookies to be sent/received
		});

		const result = await response.json();

		if (response.ok) {
			return {
				type: 'success',
				message: result.message || 'Login successful'
			};
		}

		return {
			type: 'error',
			message: result.message || 'Login failed'
		};
	} catch (error) {
		console.error('Login error:', error);
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		return {
			type: 'error',
			message: errorMessage
		};
	}
}
