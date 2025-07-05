export default {
  async fetch(request) {
    const wallpapers = [
      "https://w.wallhaven.cc/full/po/wallhaven-po2vg3.jpg",
      "https://w.wallhaven.cc/full/je/wallhaven-je82zp.jpg"
    ];
    const randomUrl = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    return Response.redirect(randomUrl, 302);
  }
}