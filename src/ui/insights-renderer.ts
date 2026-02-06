export function renderStrategies(
  dbData: any[], 
  tabsContainer: HTMLElement, 
  viewContainer: HTMLElement
) {
    if (!dbData || dbData.length === 0) {
        tabsContainer.innerHTML = '<p>No analysis data found yet.</p>';
        return;
    }

    const strategies = new Set<string>();
    dbData.forEach(record => {
        if (record.data) {
            Object.keys(record.data).forEach(key => strategies.add(key));
        }
    });

    if (strategies.size === 0) {
        tabsContainer.innerHTML = '<p>No strategies detected.</p>';
        return;
    }

    tabsContainer.innerHTML = '';
    strategies.forEach(strategyName => {
        const btn = document.createElement('button');
        btn.textContent = formatStrategyName(strategyName);
        btn.style.backgroundColor = '#333';
        btn.style.fontSize = '0.9em';
        
        btn.onclick = () => {
            Array.from(tabsContainer.children).forEach((c: any) => c.style.backgroundColor = '#333');
            btn.style.backgroundColor = '#646cff';
            renderStrategyView(strategyName, dbData, viewContainer);
        };
        
        tabsContainer.appendChild(btn);
    });

    (tabsContainer.firstChild as HTMLElement)?.click();
}

function renderStrategyView(strategyName: string, allData: any[], container: HTMLElement) {
    const relevantRecords = allData.filter(r => r.data && r.data[strategyName]);
    
    if (relevantRecords.length === 0) {
        container.innerHTML = '<p>No data for this strategy.</p>';
        return;
    }

    container.innerHTML = relevantRecords.map(record => `
      <div style="background: #1a1a1a; padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #444;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #eee; word-break: break-all; font-size: 0.95em;">${record.url}</h4>
            <span style="font-size: 0.8em; color: #888;">${new Date(record.lastUpdated).toLocaleTimeString()}</span>
        </div>
        <pre style="background: #000; color: #4af; padding: 10px; overflow-x: auto; font-size: 0.85em;">${JSON.stringify(record.data[strategyName], null, 2)}</pre>
      </div>
    `).join('');
}

function formatStrategyName(name: string) {
    return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}