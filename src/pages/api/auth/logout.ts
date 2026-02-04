import type { APIRoute } from 'astro';

// API endpoint for user logout
export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Clear auth cookies
    cookies.delete('auth_token', { path: '/' });
    cookies.delete('user_data', { path: '/' });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logout berhasil!'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Terjadi kesalahan server' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Also allow GET for simple logout links
export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('auth_token', { path: '/' });
  cookies.delete('user_data', { path: '/' });
  
  return redirect('/masuk?logout=success');
};
