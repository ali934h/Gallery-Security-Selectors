// Generate a random API Key
function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'gss_'; // Prefix: Gallery Security Selectors
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// GET: Retrieve current API Key
export async function onRequestGet(context) {
  try {
    const apiKey = await context.env.GALLERY_SECURITY_SELECTORS.get('__api_key__');
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        exists: false,
        apiKey: null 
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ 
      exists: true,
      apiKey: apiKey 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('GET /api/apikey error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Generate new API Key
export async function onRequestPost(context) {
  try {
    const newApiKey = generateApiKey();
    
    // Store API Key in KV with special prefix to distinguish from site data
    await context.env.GALLERY_SECURITY_SELECTORS.put('__api_key__', newApiKey);

    return new Response(JSON.stringify({ 
      success: true,
      apiKey: newApiKey,
      message: 'API Key generated successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('POST /api/apikey error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// OPTIONS: For CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}