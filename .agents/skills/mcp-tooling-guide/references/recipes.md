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
