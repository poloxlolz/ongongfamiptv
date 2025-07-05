export default {
  async fetch(request) {

    const response = await fetch("https://wallhaven.cc/api/v1/search?q=landscape&categories=010&purity=100&atleast=1920x1080&ratios=16x9&sorting=random");
    if (!response.ok) {
      return new Response("Failed to fetch from Wallhaven", { status: 500 });
    }

    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      return new Response("No images found", { status: 404 });
    }

    return Response.redirect(json.data[0].path, 302);
  }
};