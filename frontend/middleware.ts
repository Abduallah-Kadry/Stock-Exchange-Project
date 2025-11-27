import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// This is a middleware that runs on every request
export function middleware(request: NextRequest) {
	// Get the auth token from the cookies
	const token = request.cookies.get('jwt')?.value;


	// Skip auth check for login/register API routes
	const isPublicApi = request.nextUrl.pathname.startsWith('/api/auth/');
	if (isPublicApi) {
		return NextResponse.next();
	}

	const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
		request.nextUrl.pathname.startsWith('/register');

	// If there's no token and the user is trying to access a protected route
	if (!token && !isAuthPage) {
		// Store the current URL so we can redirect back after login
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('from', request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}

	// If there is a token and the user is trying to access login page
	if (token && request.nextUrl.pathname.startsWith('/login')) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Allow access to register page even with a token


	// For API routes, we need to forward the cookies
	if (request.nextUrl.pathname.startsWith('/api/')) {


		const response = NextResponse.next({
			request: {
				headers: new Headers(request.headers),
			},
		});

		// Ensure credentials are included for all API requests

		// Handle CORS if needed (uncomment and modify as per your requirements)
		// response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
		// response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		// response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

		return response;
	}

	return NextResponse.next();
}

// Configure which paths this middleware should run on
export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico).*)',
		'/dashboard/:path*',
		'/profile/:path*',
		'/api/:path*'
	],
};