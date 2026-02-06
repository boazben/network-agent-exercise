import { safeFetchJSON } from '../utils/http-client';
import { getInsights } from '../services/insights.service';
import { renderStrategies } from '../ui/insights-renderer';

const getUI = () => ({
  output: document.getElementById('output') as HTMLPreElement,
  insightsWrapper: document.getElementById('insights-wrapper') as HTMLDivElement,
  strategyTabs: document.getElementById('strategy-tabs') as HTMLDivElement,
  strategyView: document.getElementById('strategy-view') as HTMLDivElement,
});

export async function handleFetch(url: string) {
  const ui = getUI();
  
  ui.insightsWrapper.style.display = 'none';
  ui.output.textContent = 'Loading...';
  ui.output.style.color = 'inherit';

  try {
    const data = await safeFetchJSON(url);
    ui.output.textContent = JSON.stringify(data, null, 2);
  } catch (error: any) {
    ui.output.style.color = '#ff4444';
    ui.output.textContent = `❌ ${error.message}`;
  }
}

export async function handleInsights() {
  const ui = getUI();
  
  ui.output.textContent = 'Data hidden. Viewing insights...';
  ui.output.style.color = '#888';
  ui.insightsWrapper.style.display = 'block';
  
  ui.strategyTabs.innerHTML = 'Loading...';
  ui.strategyView.innerHTML = '';

  try {
    const data = await getInsights();
    renderStrategies(data, ui.strategyTabs, ui.strategyView);
  } catch (error: any) {
    ui.strategyTabs.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
  }
}