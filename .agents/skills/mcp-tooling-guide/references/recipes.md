# MCP Invocation Recipes & Payloads

## 1. Context7 (Library Documentation)
Two-step lookup pattern:
```json
// Step 1: Resolve Library ID
{
  "ServerName": "context7",
  "ToolName": "resolve-library-id",
  "Arguments": {
    "libraryName": "nativewind",
    "query": "NativeWind 4 web transitions"
  }
}

// Step 2: Query Documentation with returned libraryId
{
  "ServerName": "context7",
  "ToolName": "query-docs",
  "Arguments": {
    "libraryId": "/nativewind/nativewind",
    "query": "web transition prefix configuration"
  }
}
```

---

## 2. Playwright (Web & UI Automation)
```json
// Navigate & Snapshot
{
  "ServerName": "playwright",
  "ToolName": "browser_navigate",
  "Arguments": { "url": "http://localhost:3000" }
}

// Run JS evaluation
{
  "ServerName": "playwright",
  "ToolName": "browser_evaluate",
  "Arguments": { "function": "() => document.title" }
}

// Close session
{
  "ServerName": "playwright",
  "ToolName": "browser_close",
  "Arguments": {}
}
```

---

## 3. Zen Browser (Live User Browser Automation)
Prerequisite: `& "C:\Program Files\Zen Browser\zen.exe" --remote-debugging-port 9222`
```json
{
  "ServerName": "zen-browser",
  "ToolName": "zen_navigate",
  "Arguments": { "url": "https://example.com" }
}
```

---

## 4. Memory (Persistent Knowledge Graph)
```json
// Create Entity
{
  "ServerName": "memory",
  "ToolName": "create_entities",
  "Arguments": {
    "entities": [
      {
        "name": "cmews-app",
        "entityType": "Project",
        "observations": ["Expo SDK 54, React Native 0.81.4"]
      }
    ]
  }
}

// Search Entities
{
  "ServerName": "memory",
  "ToolName": "search_nodes",
  "Arguments": { "query": "cmews-app" }
}
```

---

## 5. Visualization (ECharts SVG Charts)
```json
{
  "ServerName": "visualization",
  "ToolName": "render_chart",
  "Arguments": {
    "width": 600,
    "height": 350,
    "spec": {
      "title": { "text": "Forecast Timeline" },
      "xAxis": { "data": ["00:00", "06:00", "12:00", "18:00"], "type": "category" },
      "yAxis": { "type": "value" },
      "series": [{ "data": [24, 27, 33, 28], "type": "line", "smooth": true }]
    }
  }
}
```

---

## 6. NotebookLM (Google NotebookLM Grounded Query & Research)

### Check Health & Auth Status
```json
{
  "ServerName": "notebooklm",
  "ToolName": "get_health",
  "Arguments": {}
}
```

### First-Time Interactive Google Login
```json
{
  "ServerName": "notebooklm",
  "ToolName": "setup_auth",
  "Arguments": {}
}
```

### Register a Notebook in Local Library
```json
{
  "ServerName": "notebooklm",
  "ToolName": "add_notebook",
  "Arguments": {
    "name": "Project Architecture & Requirements",
    "url": "https://notebooklm.google.com/notebook/YOUR_NOTEBOOK_ID",
    "description": "System architecture, specifications, and design decisions",
    "topics": ["architecture", "guidelines"],
    "tags": ["cmews", "spec"]
  }
}
```

### List Notebooks & Select Active Notebook
```json
// List all notebooks
{
  "ServerName": "notebooklm",
  "ToolName": "list_notebooks",
  "Arguments": {}
}

// Select active notebook
{
  "ServerName": "notebooklm",
  "ToolName": "select_notebook",
  "Arguments": {
    "id": "YOUR_NOTEBOOK_ID_OR_NAME"
  }
}
```

### Query Active Notebook with Citations
```json
{
  "ServerName": "notebooklm",
  "ToolName": "ask_question",
  "Arguments": {
    "question": "What are the core requirements and design principles for this project?",
    "source_format": "footnotes"
  }
}
```

### Ingest Sources & Generate Audio
```json
// Ingest text/url source
{
  "ServerName": "notebooklm",
  "ToolName": "add_source",
  "Arguments": {
    "type": "url",
    "content": "https://docs.example.com/api"
  }
}

// Generate Audio Overview
{
  "ServerName": "notebooklm",
  "ToolName": "generate_audio",
  "Arguments": {
    "custom_prompt": "Focus on system architecture and key trade-offs."
  }
}
```

