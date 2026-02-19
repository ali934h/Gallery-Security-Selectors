// Check authentication status

function getCookie(cookieString, name) {
  if (!cookieString) return null;
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

export async function onRequestGet(context) {
  const { request } = context;
  const cookieHeader = request.headers.get('Cookie');
  const authToken = getCookie(cookieHeader, 'auth_token');

  if (authToken && authToken.length > 0) {
    return new Response(
      JSON.stringify({ authenticated: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ authenticated: false }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}