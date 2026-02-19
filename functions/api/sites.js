// GET: لیست تمام سایت‌ها از KV
export async function onRequestGet(context) {
  try {
    const list = await context.env.GALLERY_SECURITY_SELECTORS.list();
    const configs = [];

    for (const key of list.keys) {
      const value = await context.env.GALLERY_SECURITY_SELECTORS.get(key.name);
      if (value) {
        try {
          configs.push(JSON.parse(value));
        } catch (e) {
          console.error(`Error parsing ${key.name}:`, e);
        }
      }
    }

    return new Response(JSON.stringify(configs), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: افزودن سایت جدید به KV
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { site, cardSelector, linkSelector, containerSelector } = body;

    if (!site || !site.trim()) {
      return new Response(JSON.stringify({ error: 'site is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const value = JSON.stringify({
      site: site.trim(),
      cardSelector: cardSelector?.trim() || '',
      linkSelector: linkSelector?.trim() || '',
      containerSelector: containerSelector?.trim() || '',
    });

    await context.env.GALLERY_SECURITY_SELECTORS.put(site.trim(), value);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE: حذف سایت از KV
export async function onRequestDelete(context) {
  try {
    const url = new URL(context.request.url);
    const site = url.searchParams.get('site');

    if (!site || !site.trim()) {
      return new Response(JSON.stringify({ error: 'site parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.GALLERY_SECURITY_SELECTORS.delete(site.trim());

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// OPTIONS: برای CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}