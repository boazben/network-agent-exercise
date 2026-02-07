# Network Intelligence Agent - Assignment Questions

## 1. High-Level Architecture & Design

The project is built as a **Client-Side Network Agent** that operates non-intrusively in the background. It adheres to **Clean Architecture** principles to ensure separation of concerns, testability, and scalability.

The system is divided into three logical layers:

### 🏛️ Layer 1: Infrastructure & Interception (The "Gatekeeper")
This layer handles the raw network traffic and system plumbing.
* **`service-worker.ts`**: Acts as a network proxy. It intercepts all `fetch` requests using the Browser's Service Worker API.
    * *Design Decision:* I use a Service Worker to ensure the analysis is **non-blocking**. The interception happens on a separate thread, ensuring the main application UI remains buttery smooth.
* **`src/services/db.service.ts`**: A Singleton wrapper around **IndexedDB**.
    * *Design Decision:* Direct IndexedDB API is verbose. I wrap it to ensure a single connection point and consistent schema management (handling upgrades/migrations automatically).

### 🧠 Layer 2: Core Domain & Analysis (The "Brain")
This layer contains the business logic and doesn't care about the UI or the Network transport.
* **`src/services/traffic-analyzer.service.ts`**: The bridge/orchestrator. It receives raw Responses from the SW, extracts the JSON payload, and delegates the work to the strategies.
* **`src/strategies/`**: Implements the **Strategy Pattern**.
    * *Design Decision:* Instead of hardcoding logic like "count words" inside the service, I created an interface (`IStrategy`). This allows to plug in new algorithms (like TF-IDF, Sentiment Analysis, etc.) or to modify or upgrade existing one, without touching the core code. This adheres to the **Open/Closed Principle** (Open for extension, closed for modification).

### 🎨 Layer 3: Presentation (The UI)
This layer is responsible for visualization only. It knows how to ask for data but not how to process it.
* **`src/app/app.controller.ts`**: The glue between the UI and the Data Layer. It orchestrates the flow.
* **`src/ui/`**: Pure rendering functions. Keeps `main.ts` clean and readable.

---

### 2. Handling Dynamic URLs & Data Normalization

To prevent the database from getting full of duplicates, I treat URLs as **Resources** instead of just strings.
My strategy involves two simple steps to "clean" the URL before saving it:

1.  **Ignore Query Parameters:**
    * Requests like `api/data?sort=asc` and `api/data?filter=active` are fetching the same data.
    * **Solution:** I simply strip away everything after the `?` character. I only use the base path for analytics.

2.  **Generalize Dynamic IDs:**
    * Saving distinct entries for `users/1`, `users/2`, etc., makes the data useless for aggregation.
    * **Solution:** I split the URL path into segments.
    * If a segment looks like an ID (e.g., a number like `123` or a long random string like a UUID), I replace it with a placeholder like `:id`.
    * *Result:* `/users/123/posts` becomes `/users/:id/posts`, allowing me to see statistics for "All User Posts" together.


### 3. Storage Eviction Policy (When Quota is Full)

Browsers have strict storage limits. To prevent the app from crashing when the disk is full, I use a **Least Recently Used (LRU)** strategy to delete old data.

**The Logic:**
1.  **Check Quota:** Before saving large data, I check `navigator.storage.estimate()` to see how much space is left.
2.  **The Trigger:** If usage exceeds ~80%, I start a cleanup process.
3.  **Delete Oldest:** Since every record in my DB has a `lastUpdated` timestamp, I simply find the records with the oldest dates and delete them until I have enough free space for the new data.

### 4. Security Risks & Mitigation

Saving network traffic in the browser (IndexedDB) does have risks. Here is how I handle them:

**The Risks:**
1.  **Malicious Scripts (XSS):** If a hacker manages to run a bad script on the website, they can read everything stored in IndexedDB.
2.  **Accidental Secrets:** The API might return sensitive data (like `password`, `token`, or `credit_card`) inside the JSON. We don't want to save this to the disk.

**My Solution (Mitigation):**
* **Data Sanitization (Cleaning):** Before saving any JSON, I run a simple function that looks for keys like "password", "token", or "auth". If found, I delete them. This ensures we only save harmless data.
* **Local Only:** I deliberately do **not** upload this data to a cloud server. This keeps the data private on the user's machine.

### 5. Personal Note: Methodology & AI Utilization

As a **Backend Developer** with 4 years of experience (specializing in Nest.js, Kubernetes, and Cloud Architectures), I approached this client-side assignment with a "System Design" mindset.

Since my daily focus is on server-side logic and scalability rather than DOM manipulation and CSS, I leveraged AI tools to bridge the syntax gap and accelerate development.

**How I managed the development process:**

* **Architecture First:** I defined the **Clean Architecture** layers, the directory structure, and the specific Design Patterns (Strategy for analysis, Singleton for DB, Factory for events) *before* writing a single line of code.
* **AI as a Junior Partner:** I utilized AI to handle the implementation details of the **UI layer** (HTML/CSS layout, specific DOM events) where my recent hands-on experience is limited.
* **Code Review & Logic:** I personally reviewed, refactored, and optimized the core logic (Traffic Analyzer, Service Worker, and Strategies) to ensure it meets the strict performance and modularity standards I apply in Backend development.

This approach allowed me to deliver a robust, well-engineered solution while effectively managing the learning curve of modern vanilla JavaScript.