import type { APIRoute } from 'astro';

// API endpoint for user registration
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, username, displayName } = body;

    // Validate input
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email, username, dan password harus diisi' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Format email tidak valid' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Password validation
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Password minimal 6 karakter' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In production, use the auth service
    // import { registerUser } from '../../../lib/auth';
    // const result = await registerUser(email, password, username, displayName);

    // Mock successful registration
    const mockUser = {
      id: Math.random().toString(36).substring(7),
      email,
      username,
      displayName: displayName || username,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Registrasi berhasil! Silakan login.',
        user: mockUser
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Register error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Terjadi kesalahan server' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
