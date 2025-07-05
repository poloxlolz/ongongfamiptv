// src/index.js
var index_default = {
  async fetch(request, env, ctx) {

    const cache = caches.default;
    const cacheKey = new Request(request.url, { method: 'GET' });

    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      console.log("CACHE HIT ✅");
      return cachedResponse;
    }
    console.log("CACHE MISS ❌");


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
    const redirectResponse = new Response(null, {
      status: 302,
      headers: {
        "Location": redirectUrl,
        "Cache-Control": "public, max-age=10"
      }
    });
    ctx.waitUntil(cache.put(request, redirectResponse.clone()));
    return redirectResponse;
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
