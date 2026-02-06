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
    
    <div id="insights-wrapper" style="margin-top: 20px; text-align: left; display: none; border-top: 1px solid #444; padding-top: 20px;">
        <h3 style="margin-top: 0;">Analysis Results</h3>
        <p style="font-size: 0.9em; color: #aaa;">Select a strategy to view aggregated data:</p>
        <div id="strategy-tabs" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;"></div>
        <div id="strategy-view"></div>
    </div>
  </div>
`

const output = document.getElementById('output') as HTMLPreElement;
const insightsWrapper = document.getElementById('insights-wrapper') as HTMLDivElement;
const strategyTabs = document.getElementById('strategy-tabs') as HTMLDivElement;
const strategyView = document.getElementById('strategy-view') as HTMLDivElement;

async function fetchData(url: string) {
  insightsWrapper.style.display = 'none';
  
  output.textContent = 'Loading...';
  output.style.color = 'inherit';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);

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
    
    insightsWrapper.style.display = 'block';
    strategyTabs.innerHTML = 'Loading strategies...';
    strategyView.innerHTML = '';
    
    try {
        const { getInsights } = await import('../services/insights.service');
        const data = await getInsights();
        renderStrategies(data);
    } catch (e) {
        strategyTabs.innerHTML = `<p style="color:red">Error loading insights: ${e}</p>`;
    }
});

function renderStrategies(dbData: any[]) {
    if (!dbData || dbData.length === 0) {
        strategyTabs.innerHTML = '<p>No analysis data found yet.</p>';
        return;
    }

    const strategies = new Set<string>();
    dbData.forEach(record => {
        if (record.data) {
            Object.keys(record.data).forEach(key => strategies.add(key));
        }
    });

    if (strategies.size === 0) {
        strategyTabs.innerHTML = '<p>No strategies detected in stored data.</p>';
        return;
    }

    strategyTabs.innerHTML = '';
    strategies.forEach(strategyName => {
        const btn = document.createElement('button');
        btn.textContent = formatStrategyName(strategyName);
        btn.className = 'strategy-btn'; 
        btn.style.backgroundColor = '#333';
        btn.style.fontSize = '0.9em';
        
        btn.onclick = () => {
            Array.from(strategyTabs.children).forEach((c: any) => c.style.backgroundColor = '#333');
            btn.style.backgroundColor = '#646cff';
            
            renderStrategyView(strategyName, dbData);
        };
        
        strategyTabs.appendChild(btn);
    });

    (strategyTabs.firstChild as HTMLElement)?.click();
}

function renderStrategyView(strategyName: string, allData: any[]) {
    const relevantRecords = allData.filter(r => r.data && r.data[strategyName]);
    
    if (relevantRecords.length === 0) {
        strategyView.innerHTML = '<p>No data for this strategy.</p>';
        return;
    }

    const html = relevantRecords.map(record => `
      <div style="background: #1a1a1a; padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #444;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #eee; word-break: break-all; font-size: 0.95em;">${record.url}</h4>
            <span style="font-size: 0.8em; color: #888;">${new Date(record.lastUpdated).toLocaleTimeString()}</span>
        </div>
        
        <pre style="background: #000; color: #4af; padding: 10px; overflow-x: auto; font-size: 0.85em; border-radius: 4px;">${JSON.stringify(record.data[strategyName], null, 2)}</pre>
      </div>
    `).join('');

    strategyView.innerHTML = html;
}

function formatStrategyName(name: string) {
    return name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    new URL('/service-worker.ts', import.meta.url),
    { type: 'module', scope: '/' }
  ).then((registration) => console.log('SW Scope:', registration.scope));
}