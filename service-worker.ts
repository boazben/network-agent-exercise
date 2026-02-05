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


async function analyzeResponse(url: string, response: Response) {
  try {
    const data = await response.json();
    console.log(`[Analysis] Intercepted data from ${url}:`, data);
  } catch (err) {
    console.error("[Analysis] Failed to parse JSON:", err);
  }
}

function isResToAnalyze(response: Response): boolean {
  const contentType = response.headers.get("content-type");
  const isJson = Boolean(contentType && contentType.includes("application/json"));
  const isOkResponse = response.status >= 200 && response.status < 300;
  return isJson && isOkResponse;
}