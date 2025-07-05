export default {
  async fetch(request, ctx) {
    const cache = caches.default;

    // Check cache first
    let cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;


    // No cache: fetch from Wallhaven
    const response = await fetch("https://wallhaven.cc/api/v1/search?q=landscape&categories=010&purity=100&atleast=1920x1080&ratios=16x9&sorting=random");
    if (!response.ok) {
      return new Response("Failed to fetch from Wallhaven", { status: 500 });
    }

    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      return new Response("No images found", { status: 404 });
    }


    const results = json.data;
    const randomIndex = Math.floor(Math.random() * results.length);
    const redirectUrl = results[randomIndex].path;

    // Cache it for x duration
    const redirectResponse = new Response(null, {
      status: 302,
      headers: {
        "Location": redirectUrl,
        "Cache-Control": "public, max-age=10"
      }
    });

    
    // const redirectResponse = Response.redirect(redirectUrl, 302);
    // redirectResponse.headers.set("Cache-Control", "public, max-age=10");

    ctx.waitUntil(cache.put(request, redirectResponse.clone()));

    // Cache the response asynchronously
    return redirectResponse;



  }
};