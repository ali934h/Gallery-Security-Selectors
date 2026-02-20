// Public API endpoint to get all sites with API Key authentication
export async function onRequestGet(context) {
  try {
    // Get API Key from request header
    const apiKey = context.request.headers.get('X-API-Key');
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key is required. Please provide X-API-Key header.' }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Validate API Key from KV
    const storedApiKey = await context.env.GALLERY_SECURITY_SELECTORS.get('__api_key__');
    
    if (!storedApiKey || storedApiKey !== apiKey) {
      return new Response(JSON.stringify({ error: 'Invalid API Key' }), {
        status: 403,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Fetch all sites from KV
    const list = await context.env.GALLERY_SECURITY_SELECTORS.list();
    const configs = [];

    for (const key of list.keys) {
      // Skip internal keys (like __api_key__)
      if (key.name.startsWith('__')) {
        continue;
      }

      const value = await context.env.GALLERY_SECURITY_SELECTORS.get(key.name);
      if (value) {
        try {
          configs.push(JSON.parse(value));
        } catch (e) {
          console.error(`Error parsing ${key.name}:`, e);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      count: configs.length,
      sites: configs
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('GET /public-api/sites error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// OPTIONS: For CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}