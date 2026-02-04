import type { APIRoute } from 'astro';

// API endpoint for user login
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email dan password harus diisi' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In production, use the auth service
    // import { loginUser } from '../../../lib/auth';
    // const result = await loginUser(email, password);

    // Mock login - check for demo accounts
    let mockUser = null;
    let token = 'mock_token_' + Math.random().toString(36).substring(7);

    // Demo accounts
    if (email === 'admin@astro.id' && password === 'admin123') {
      mockUser = {
        id: '1',
        email: 'admin@astro.id',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=EF4444&color=fff'
      };
    } else if (email === 'sakura@astro.id' && password === 'vtuber123') {
      mockUser = {
        id: '2',
        email: 'sakura@astro.id',
        username: 'sakurahana',
        displayName: 'Sakura Hana',
        role: 'vtuber',
        avatar: 'https://ui-avatars.com/api/?name=Sakura+Hana&background=8B5CF6&color=fff',
        vtuberName: 'Sakura Hana',
        vtuberAgency: 'ASTRO VTuber',
        vtuberFollowers: 12500
      };
    } else if (email === 'user@astro.id' && password === 'user123') {
      mockUser = {
        id: '3',
        email: 'user@astro.id',
        username: 'cinemauser',
        displayName: 'Cinema User',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Cinema+User&background=3B82F6&color=fff'
      };
    } else {
      // For any other credentials, create a regular user (demo purposes)
      mockUser = {
        id: Math.random().toString(36).substring(7),
        email,
        username: email.split('@')[0],
        displayName: email.split('@')[0],
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366F1&color=fff`
      };
    }

    // Set auth cookie
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Set user data cookie (not httpOnly so JS can read it)
    cookies.set('user_data', JSON.stringify({
      id: mockUser.id,
      username: mockUser.username,
      displayName: mockUser.displayName,
      role: mockUser.role,
      avatar: mockUser.avatar
    }), {
      path: '/',
      httpOnly: false,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login berhasil!',
        user: mockUser,
        token,
        redirectUrl: mockUser.role === 'admin' 
          ? '/admin/dashboard' 
          : mockUser.role === 'vtuber' 
            ? '/vtuber' 
            : '/akun/dashboard'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Terjadi kesalahan server' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
