import { analyzeResponse, isResToAnalyze } from "./src/services/traffic-analyzer.service";

self.addEventListener("install", (event) => {
  console.log(
    "[Service Worker] Installing new version...",
    new Date().toTimeString(),
  );

  //@ts-ignore
  // Note: Aggressive takeover for dev speed.
  // In production, a "prompt-to-update" flow is preferred to avoid version mismatches.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated and ready to intercept requests!");
  //@ts-ignore
  // Immediately control open clients without waiting for a reload.
  // Helping for dev speed, handled carefully in prod.
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event: any) => {
  if (!event.request.url.startsWith("http")) {
    return;
  }
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);

        if (isResToAnalyze(response)) {
          const responseClone = response.clone();

          // Without blocking the response to the user, analyze in background so I removed the await
          analyzeResponse(event.request.url, responseClone);
        }

        return response;
      } catch (error) {
        console.error("[SW] Network error:", error);
        throw error;
      }
    })(),
  );
});
