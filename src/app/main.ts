import '../style.css';
import { renderStrategies } from '../ui/insights-renderer';
import { safeFetchJSON } from '../utils/http-client';
import { getInsights } from '../services/insights.service';
import { renderLayout } from '../ui/layout';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;
renderLayout(appRoot);

const output = document.getElementById('output') as HTMLPreElement;
const insightsWrapper = document.getElementById('insights-wrapper') as HTMLDivElement;
const strategyTabs = document.getElementById('strategy-tabs') as HTMLDivElement;
const strategyView = document.getElementById('strategy-view') as HTMLDivElement;

async function handleFetch(url: string) {
  insightsWrapper.style.display = 'none';
  output.textContent = 'Loading...';
  output.style.color = 'inherit';

  try {
    const data = await safeFetchJSON(url);
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error: any) {
    output.style.color = '#ff4444';
    output.textContent = `❌ ${error.message}`;
  }
}

async function handleInsights() {
  output.textContent = 'Data hidden. Viewing insights...';
  output.style.color = '#888';
  insightsWrapper.style.display = 'block';
  
  strategyTabs.innerHTML = 'Loading...';
  strategyView.innerHTML = '';

  try {
    const data = await getInsights();
    renderStrategies(data, strategyTabs, strategyView);
  } catch (error: any) {
    strategyTabs.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
  }
}

document.getElementById('btn-user')?.addEventListener('click', () => handleFetch('https://randomuser.me/api/'));
document.getElementById('btn-posts')?.addEventListener('click', () => handleFetch('https://jsonplaceholder.typicode.com/posts?_limit=5'));

document.getElementById('btn-error-404')?.addEventListener('click', () => handleFetch('https://jsonplaceholder.typicode.com/posts/999999'));
document.getElementById('btn-error-type')?.addEventListener('click', () => handleFetch('/index.html'));
document.getElementById('btn-error-net')?.addEventListener('click', () => handleFetch('https://domain-does-not-exist.local'));

document.getElementById('btn-insights')?.addEventListener('click', handleInsights);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    new URL('/service-worker.ts', import.meta.url),
    { type: 'module', scope: '/' }
  ).then((reg) => console.log('SW Ready:', reg.scope));
}