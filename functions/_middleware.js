// Middleware to handle authentication and custom admin path

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Get custom admin path from environment variable
  const ADMIN_PATH = env.ADMIN_PATH || 'admin';
  const adminPathWithSlash = `/${ADMIN_PATH}`;

  // Allow static assets and API calls to pass through
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return next();
  }

  // Check if accessing the correct admin path
  if (pathname === adminPathWithSlash || pathname === `${adminPathWithSlash}/`) {
    // Continue to the page
    return next();
  }

  // All other paths return 404
  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
}