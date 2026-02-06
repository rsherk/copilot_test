# Markdown Editor - Architecture & Design

## System Overview

```
User Interface (Browser)
│
├─ Left Panel: Textarea Input
│  └─ ID: #markdown-input
│     └─ Listens to: input, change events
│
└─ Right Panel: Preview
   └─ ID: #preview
      └─ Renders: HTML from marked.js + DOMPurify

Storage: Browser localStorage
└─ Key: 'markdown-content'
   └─ Persists: Plain markdown text
```

## Data Flow

### Writing Content
```
User Types in Textarea
    ↓
'input' Event Fires
    ↓
renderMarkdown()          → Parse markdown with marked.js
    ↓                       → Sanitize HTML with DOMPurify
Preview Updates            → Display in #preview panel
    ↓
saveMarkdown()            → localStorage.setItem('markdown-content', content)
```

### Loading Content
```
Page Load / Refresh
    ↓
loadMarkdown()
    ↓
localStorage.getItem('markdown-content')
    ↓
Restore textarea.value
    ↓
renderMarkdown()          → Display restored preview
```

## File Architecture

### src/index.html (6.8 KB)
**Single-file application** - Everything needed in one HTML file.

**Structure:**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport"> <!-- Responsive -->
    <title>Markdown Editor</title>
    
    <!-- External Libraries (CDN) -->
    <script src="marked.js">       <!-- Markdown parser -->
    <script src="dompurify.js">    <!-- XSS protection -->
    
    <style>                        <!-- All CSS embedded -->
      /* Layout: Flexbox 50/50 split view */
      /* Responsive: Stacks on mobile */
      /* Styling: Professional editor UI -->
    </style>
  </head>
  
  <body>
    <header>...</header>
    
    <div class="container">
      <div class="editor-panel">
        <textarea id="markdown-input"></textarea>
      </div>
      
      <div class="preview-panel">
        <div id="preview"></div>
      </div>
    </div>
    
    <script>
      // Event listeners: input, change, beforeunload
      // Functions: renderMarkdown(), saveMarkdown(), loadMarkdown()
    </script>
  </body>
</html>
```

### Key JavaScript Functions

**renderMarkdown()**
```javascript
- Gets textarea.value
- Calls marked.parse() to convert markdown → HTML
- Sanitizes with DOMPurify.sanitize()
- Injects clean HTML into #preview
- Error handling for invalid markdown
```

**saveMarkdown()**
```javascript
- Gets textarea.value
- Saves to localStorage['markdown-content']
- Called on: input, change, beforeunload events
```

**loadMarkdown()**
```javascript
- Retrieves from localStorage['markdown-content']
- Restores textarea.value
- Calls renderMarkdown() to show preview
- Initializes with welcome text if empty
```

## Event Handling

| Event | Trigger | Action |
|-------|---------|--------|
| input | User types | renderMarkdown() + saveMarkdown() |
| change | Input loses focus | saveMarkdown() |
| beforeunload | Page close/refresh | saveMarkdown() |
| DOMContentLoaded (implicit) | Page load | loadMarkdown() |

## Dependencies

### Runtime (Included via CDN)
- **marked** (12.0.0+) - Markdown → HTML conversion
- **DOMPurify** (3.0.6+) - HTML sanitization (XSS protection)

### Development (npm)
- **@playwright/test** (1.48.0+) - E2E testing
- **http-server** - Local dev server

## Build Pipeline

```
npm run build
    ↓
scripts/build.js (Node.js)
    ↓
    ├─ Read: src/
    ├─ Copy: All files
    └─ Write: dist/
    ↓
dist/index.html (Ready to deploy)
```

**Build script** uses Node.js `fs` module to recursively copy src/ → dist/.

## Testing Architecture

### Test Suite: tests/e2e/editor.spec.js

**Framework**: Playwright
**Configuration**: playwright.config.js

**Test Categories**

1. **Rendering Tests**
   - Basic markdown (headings, bold text)
   - Lists (ul/ol)
   - Code blocks
   - Links
   - Blockquotes, images, tables

2. **Persistence Tests**
   - Auto-save on input
   - Restore after reload
   - localStorage integration

3. **Functionality Tests**
   - Real-time preview updates
   - Error handling (invalid markdown)
   - Empty content handling

**Test Setup**
```javascript
beforeEach: Clear localStorage, reload page
Tests: Isolated, no side effects
```

## Deployment

### Option 1: Static File Host
```
dist/index.html → GitHub Pages / Netlify / Vercel / S3
```
No server-side code needed.

### Option 2: Web Server
```
dist/index.html → Apache / Nginx / Express
```
Serve as static file.

### Option 3: Self-Hosted
```
dist/index.html → Any HTTP server
```

⚠️ **Requirement**: Must be served over HTTP/HTTPS (not file://) for localStorage to work.

## Security Considerations

### XSS Protection
- **DOMPurify** sanitizes all HTML before rendering
- Prevents script injection via markdown
- Removes dangerous attributes and tags

### CSRF Protection
- N/A (no server-side requests)

### Data Privacy
- All data stored locally in browser
- No network transmission
- User has full control

## Performance

### Initial Load
- Single HTTP request for index.html
- CDN scripts loaded async (marked.js, DOMPurify)
- Total size: ~8 KB HTML + CDN assets

### Real-time Updates
- marked.js parses on every keystroke
- Optimized for typical markdown sizes (< 1 MB)
- DOMPurify runs after each parse

### Storage
- localStorage limit: 5-10 MB (varies by browser)
- Stores plain text (highly compressible)

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ 90+ | Full support |
| Firefox | ✅ 88+ | Full support |
| Safari | ✅ 14+ | Full support |
| Mobile | ✅ | Responsive layout included |

## Responsive Design

**Desktop (> 768px)**
```
[Editor | Preview]
  50%     50%
```

**Mobile (≤ 768px)**
```
[Editor]
[Preview]
```

## Future Enhancement Ideas

1. **Dark Mode**
   - Toggle via button
   - Persist preference

2. **Export**
   - Download as .md, .html, .pdf

3. **Syntax Highlighting**
   - highlight.js for code blocks

4. **Table of Contents**
   - Auto-generate from headings

5. **Collaborative**
   - WebSocket sync
   - Multi-user editing

6. **Extensions**
   - Plantuml diagrams
   - Math equations (KaTeX)
   - Emoji support

---

**Created**: 2026-02-06
**Status**: Production Ready ✓
