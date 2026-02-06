export function renderLayout(appRoot: HTMLElement) {
  appRoot.innerHTML = `
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
  `;
}