# Quick Start Guide

## Overview

Your markdown editor project is ready! It's a single-page HTML application with live preview and auto-save functionality.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```
This copies `src/index.html` to `dist/index.html`.

### 3. Run Locally
```bash
npm run serve
```
Opens the editor at `http://localhost:8080` in your default browser.

## Project Structure

```
markdown-editor/
├── src/
│   └── index.html              # Main app (edit this file)
├── dist/                       # Production output (generated)
├── tests/
│   └── e2e/
│       └── editor.spec.js      # Test suite
├── scripts/
│   └── build.js               # Build script
├── package.json               # Dependencies
└── playwright.config.js       # Test config
```

## Key Features

### Live Editing
- Type markdown in the **left panel**
- See rendered output in the **right panel** instantly
- Textarea auto-updates as you type

### Persistence
- **Auto-save to localStorage**: Content saves every time you type
- **Restoration on reload**: Closing and reopening the page restores your content
- Each browser has its own localStorage (different browsers = different saved content)

### How It Works

The `src/index.html` file handles everything:

1. **Markdown Parsing**: Uses [marked.js](https://marked.js.org/) to convert markdown to HTML
2. **Sanitization**: Uses [DOMPurify](https://github.com/cure53/DOMPurify) to prevent XSS attacks
3. **Auto-Save**: The textarea's `input` event triggers:
   - Re-rendering the preview
   - Saving to localStorage
4. **Content Restoration**: On page load, localStorage content is restored

## Publishing

### For Static Hosting
1. Run: `npm run build`
2. Copy the `dist/index.html` file to your web server
3. No server-side code needed—it's a purely client-side app

### Important Notes
- **File-based access**: ⚠️ localStorage only works over HTTP/HTTPS or `localhost`. Opening the HTML file directly with `file://` won't save data.
- **Browser-specific**: Each browser stores data separately. Users switching browsers won't see previously saved content.

## Testing

### Run All Tests
```bash
npm test
```

### Run with UI Mode
```bash
npm run test:ui
```
Open browser-based test runner for interactive debugging.

### What's Tested
✅ Basic markdown rendering (headings, bold)  
✅ List rendering  
✅ Code blocks  
✅ Links  
✅ Auto-save functionality  
✅ Content persistence across page reloads  
✅ Real-time preview updates  

All tests passed! ✓

## Development Tips

### Edit the Editor
- Open `src/index.html` in your favorite editor
- Make changes
- Run `npm run build` to copy to `dist/`
- Refresh your browser at `localhost:8080`

### Styling
- CSS is embedded in `src/index.html` in the `<style>` tag
- Modify the styles directly and rebuild

### JavaScript Logic
- JavaScript is in a `<script>` tag at the bottom of `src/index.html`
- Main functions:
  - `renderMarkdown()` - Converts textarea content to HTML
  - `saveMarkdown()` - Persists to localStorage
  - `loadMarkdown()` - Restores from localStorage

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Content not saving?
- Check browser console for errors
- Ensure you're accessing via `http://localhost` (not `file://`)
- Check browser's localStorage is enabled

### Preview not updating?
- Ensure JavaScript is enabled
- Check console for marked.js or DOMPurify errors
- Try refreshing the page

### Tests failing?
Run: `npx playwright install` to download browsers, then `npm test` again.

## Next Steps

You can extend the editor with:
- Dark mode toggle
- Export to PDF/HTML/Markdown
- Syntax highlighting in code blocks
- Collaborative editing
- More markdown features (tables, footnotes, etc.)

---

Happy writing! 📝
