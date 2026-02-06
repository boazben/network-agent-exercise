import { handleFetch, handleInsights } from './app.controller';

export function initEventListeners() {
  const bind = (id: string, handler: () => void) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  };

  bind('btn-user', () => handleFetch('https://randomuser.me/api/'));
  bind('btn-posts', () => handleFetch('https://jsonplaceholder.typicode.com/posts?_limit=5'));

  bind('btn-error-404', () => handleFetch('https://jsonplaceholder.typicode.com/posts/999999'));
  bind('btn-error-type', () => handleFetch('/index.html'));
  bind('btn-error-net', () => handleFetch('https://domain-does-not-exist.local'));

  bind('btn-insights', handleInsights);
}