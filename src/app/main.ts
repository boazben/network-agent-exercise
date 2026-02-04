import '../style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Network Intelligence Agent Exercise</h1>
    <p>Traffic Generator</p>
    
    <div class="card">
      <button id="btn-user">Fetch Random User</button>
      <button id="btn-posts">Fetch Posts</button>
    </div>

    <pre id="output">Click a button to see data...</pre>
  </div>
`

const btnUser = document.getElementById('btn-user') as HTMLButtonElement;
const btnPosts = document.getElementById('btn-posts') as HTMLButtonElement;
const output = document.getElementById('output') as HTMLPreElement;

async function fetchData(url: string) {
  output.textContent = 'Loading...';
  try {
    const response = await fetch(url); 
    const data = await response.json();
    
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = 'Error: ' + error;
  }
}

btnUser.addEventListener('click', () => fetchData('https://randomuser.me/api/'));
btnPosts.addEventListener('click', () => fetchData('https://jsonplaceholder.typicode.com/posts?_limit=5'));