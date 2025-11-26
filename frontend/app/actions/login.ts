'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// This mimics a DTO from your Java backend
interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Validate Input (Basic validation)
  if (!email || !password) {
    return { error: "Please enter both email and password." }
  }

  try {
    // 2. Call your Java Backend (The real logic)
    // const res = await fetch('http://localhost:8080/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })

    // MOCKING THE JAVA RESPONSE FOR NOW
    // In reality, if (!res.ok) throw new Error("Invalid credentials")
    const mockResponse: LoginResponse = {
      token: "jwt_ey_123456789",
      user: { id: "1", name: "Java Dev", email: email }
    };

    // 3. Set the Secure HTTP-Only Cookie
    // This is safer than localStorage because JS cannot access it (XSS protection)
    (await cookies()).set('session_token', mockResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

  } catch (err) {
    return { error: "Invalid credentials. Please try again." }
  }

  // 4. Redirect to Dashboard
  // This must happen outside the try/catch block in Server Actions
  redirect('/dashboard')
}