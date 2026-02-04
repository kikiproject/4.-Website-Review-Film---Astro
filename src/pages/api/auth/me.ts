import type { APIRoute } from 'astro';

// API endpoint to get current user info
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get('auth_token')?.value;
    const userData = cookies.get('user_data')?.value;

    if (!token || !userData) {
      return new Response(
        JSON.stringify({
          success: false,
          isAuthenticated: false,
          user: null
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In production, verify token with database
    // import { getUserByToken } from '../../../lib/auth';
    // const user = await getUserByToken(token);

    try {
      const user = JSON.parse(userData);
      return new Response(
        JSON.stringify({
          success: true,
          isAuthenticated: true,
          user
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          isAuthenticated: false,
          user: null
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Me error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Terjadi kesalahan server' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
