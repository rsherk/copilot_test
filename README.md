# Markdown Editor

A single-page markdown editor with live preview and persistence support.

## Features

- ✏️ **Split View Editor**: Edit markdown on the left, see the preview on the right
- 🔄 **Live Preview**: Real-time rendering as you type
- 💾 **Auto-Save**: Content is automatically saved to localStorage
- 📱 **Responsive**: Works on desktop and mobile
- 🧹 **Sanitized HTML**: XSS protection with DOMPurify
- ✅ **Playwright Tests**: Full end-to-end testing support

## Project Structure

```
.
├── src/
│   └── index.html          # Single-page application
├── dist/                   # Production build output
├── scripts/
│   └── build.js           # Build script
├── tests/
│   └── e2e/
│       └── editor.spec.js # Playwright tests
├── playwright.config.js   # Playwright configuration
└── package.json          # Dependencies and scripts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run the server:
```bash
npm run serve
```

## Development

- `npm run dev` - Start a local dev server at http://localhost:8080
- `npm run serve` - Start server and open in browser
- `npm test` - Run Playwright tests
- `npm run test:ui` - Run tests with UI mode

## How It Works

### Markdown Input
The left panel contains a textarea where you type or paste markdown content.

### Live Preview
The right panel shows the rendered HTML in real-time. As you type, the preview updates instantly using the `marked` library.

### Persistence
Your content is automatically saved to the browser's localStorage whenever you type or when the page is about to unload. When you return to the editor, your content is automatically restored.

The persistence mechanism:
1. On input/change events, content is saved to localStorage
2. On page load, content is restored from localStorage
3. Before unload, content is explicitly saved

### Technologies

- **marked**: Markdown parser and compiler
- **DOMPurify**: XSS sanitization for safe HTML rendering
- **Playwright**: End-to-end testing framework
- **http-server**: Simple local development server

## Testing

Tests cover:
- Basic markdown rendering (headings, bold text)
- List rendering
- Code block formatting
- Link rendering
- Auto-save functionality
- Real-time preview updates
- Content persistence across page reloads

Run tests:
```bash
npm test
```

## Publishing

The `dist/` folder contains the production-ready HTML file. Simply copy this to your web server or host it statically:

```bash
npm run build
# Copy dist/index.html to your server
```

## License

MIT
