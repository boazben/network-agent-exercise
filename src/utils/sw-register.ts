export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(
        new URL('/service-worker.ts', import.meta.url),
        { type: 'module', scope: '/' }
      ).then((reg) => console.log('SW Ready:', reg.scope))
       .catch((err) => console.error('SW Failed:', err));
    });
  }
}