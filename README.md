# Network Intelligence Agent 🕵️‍♂️

A browser-based network traffic interceptor and analyzer using **Service Workers** and **IndexedDB**.
This project intercepts HTTP requests in real-time, analyzes the content using pluggable strategies (like TF-IDF & Structural Weighting), and visualizes the insights.

---

## 🚀 Quick Start (Recommended)

The easiest way to run the project is using Docker. It handles all dependencies automatically.

**Prerequisites:** Docker Desktop must be running.

1. **Run the project:**
   ```bash
   docker compose up --build
> **Note:** The container handles `npm install` on startup to ensure consistency.

2. **Open your browser:**
Go to [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

---

## 🛠 Manual Setup (No Docker)

If you prefer running it locally without Docker:

**Prerequisites:** Node.js (v24 or higher).

1. **Install dependencies:**
```bash
npm install
```


2. **Start the dev server:**
```bash
npm run dev
```