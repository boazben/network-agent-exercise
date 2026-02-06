import '../style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Network Intelligence Agent</h1>
    <p>Traffic Generator</p>
    
    <div class="card">
      <button id="btn-user">Fetch Random User</button>
      <button id="btn-posts">Fetch Posts</button>
    </div>

    <div class="card" style="border-top: 1px solid #333; margin-top: 10px; padding-top: 10px;">
        <p style="font-size: 0.8em; color: #888;">Error Handling Tests:</p>
        <button id="btn-error-404" style="border-color: #ff4444; color: #ff4444;">Fetch 404</button>
        <button id="btn-error-type" style="border-color: #ffbb33; color: #ffbb33;">Fetch HTML (Bad Type)</button>
        <button id="btn-error-net" style="border-color: #ff4444; color: #ff4444;">Network Fail</button>
    </div>

    <div class="card" style="margin-top: 20px;">
        <button id="btn-insights" style="background-color: #646cff;">📊 Show Insights</button>
    </div>

    <pre id="output">Click a button to see data...</pre>
    <div id="insights-container" style="margin-top: 20px; text-align: left;"></div>
  </div>
`

const output = document.getElementById('output') as HTMLPreElement;
const insightsContainer = document.getElementById('insights-container') as HTMLDivElement;

async function fetchData(url: string) {
  insightsContainer.innerHTML = ''; 
  
  output.textContent = 'Loading...';
  output.style.color = 'inherit';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); 
        throw new Error(`Invalid Content-Type: ${contentType}. Expected JSON.\nPreview: "${text.substring(0, 30)}..."`);
    }

    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);

  } catch (error) {
    output.style.color = '#ff4444';
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        output.textContent = `❌ Network Error: Connection failed or blocked.`;
    } else {
        output.textContent = `❌ Request Failed: ${error}`;
    }
  }
}

document.getElementById('btn-user')?.addEventListener('click', () => fetchData('https://randomuser.me/api/'));
document.getElementById('btn-posts')?.addEventListener('click', () => fetchData('https://jsonplaceholder.typicode.com/posts?_limit=5'));

document.getElementById('btn-error-404')?.addEventListener('click', () => fetchData('https://jsonplaceholder.typicode.com/posts/999999'));

document.getElementById('btn-error-type')?.addEventListener('click', () => fetchData('/index.html'));

document.getElementById('btn-error-net')?.addEventListener('click', () => fetchData('https://domain-that-does-not-exist.local'));

document.getElementById('btn-insights')?.addEventListener('click', async () => {
    output.textContent = 'Data hidden. Viewing insights...';
    output.style.color = '#888';

    insightsContainer.innerHTML = 'Loading insights...';
    
    try {
        const { getInsights } = await import('../services/insights.service');
        const data = await getInsights();
        renderInsights(data);
    } catch (e) {
        insightsContainer.innerHTML = `<p style="color:red">Error loading insights: ${e}</p>`;
    }
});

function renderInsights(dbData: any[]) {
    if (!dbData || dbData.length === 0) {
        insightsContainer.innerHTML = '<p>No analysis data found yet.</p>';
        return;
    }

    const html = dbData.map(record => `
      <div style="background: #1a1a1a; padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #333;">
        <h4 style="margin: 0 0 10px 0; color: #646cff; word-break: break-all;">${record.url}</h4>
        <div style="font-size: 0.9em; color: #aaa; margin-bottom: 10px;">
          Last Updated: ${new Date(record.lastUpdated).toLocaleString()}
        </div>
        <pre style="background: #111; padding: 10px; overflow-x: auto; font-size: 0.85em;">${JSON.stringify(record.data, null, 2)}</pre>
      </div>
    `).join('');
  
    insightsContainer.innerHTML = html;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    new URL('/service-worker.ts', import.meta.url),
    { type: 'module', scope: '/' }
  ).then((registration) => console.log('SW Scope:', registration.scope));
}