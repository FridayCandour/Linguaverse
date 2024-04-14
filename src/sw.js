const RUNTIME = "offline";
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "https://cdnjs.cloudflare.com",
  "https://use.fontawesome.com",
  "https://mozilla.github.io",
];

const NETWORK_TIMEOUT_MS = 200;
// const cacheExpiration = 60; // 604800 seconds = 1 week
const cacheExpiration = 604800; // 259200 seconds = 3 day

const getFixedUrl = (req) => {
  var now = Date.now();
  var url = new URL(req.url);
  url.protocol = self.location.protocol;
  if (url.hostname === self.location.hostname) {
    url.search += (url.search ? "&" : "?") + "cache-bust=" + now;
  }
  return url.href;
};
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method === "GET" &&
    HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1
  ) {
    const cached = caches.match(event.request);

    const fixedUrl = getFixedUrl(event.request);
    const fetched = fetch(fixedUrl, { cache: "no-store" });
    const fetchedCopy = fetched.then((resp) => resp.clone());
    const delayCacheResponse = new Promise((resolve) => {
      setTimeout(resolve, NETWORK_TIMEOUT_MS, cached);
    });
    event.respondWith(
      Promise.race([fetched.catch((_) => cached), delayCacheResponse])
        .then((resp) => resp || fetched)
        .catch((_e) => {
          console.log({ _e });
          /* eat any errors */
        })
    );
    event.waitUntil(
      Promise.all([fetchedCopy, caches.open(RUNTIME)])
        .then(
          ([response, cache]) =>
            response.ok && cache.put(event.request, response)
        )
        .catch((_e) => {
          console.log({ _e });
          /* eat any errors */
        })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener("push", async (event) => {
  const notificationPayload = await event.data.json();
  const { title, body, icon } = notificationPayload;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
    })
  );
});

function checkNotifications() {
  fetch("https://example.com/api/notifications")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.notifications && data.notifications.length > 0) {
        data.notifications.forEach((notification) => {
          self.registration.showNotification(notification.title, {
            ...notification,
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error checking notifications:", error);
    });
}

self.addEventListener("message", (event) => {
  if (event.data === "Notification") {
    // Start the periodic timer to check notifications every 6 minutes
    setInterval(checkNotifications, 6 * 60 * 1000);
  }
});
