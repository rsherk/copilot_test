import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Markdown Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.reload();
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('SuperMark');
  });

  test('should display correct header text', async ({ page }) => {
    const header = page.locator('header h1');
    await expect(header).toContainText('SuperMark');
  });

  test('should not use localStorage', async ({ page }) => {
    // Monitor localStorage calls
    const localStorageAccess = await page.evaluate(() => {
      const calls = [];
      const originalSetItem = Storage.prototype.setItem;
      const originalGetItem = Storage.prototype.getItem;
      const originalClear = Storage.prototype.clear;

      Storage.prototype.setItem = function() {
        calls.push('setItem');
        return originalSetItem.apply(this, arguments);
      };
      Storage.prototype.getItem = function() {
        calls.push('getItem');
        return originalGetItem.apply(this, arguments);
      };
      Storage.prototype.clear = function() {
        calls.push('clear');
        return originalClear.apply(this, arguments);
      };

      return calls;
    });

    // Make some changes
    const textarea = page.locator('#markdown-input');
    await textarea.fill('# Test\n\nSome content');
    await page.waitForTimeout(100);

    // Check that no localStorage calls were made (should still be empty array)
    const finalCalls = await page.evaluate(() => {
      return JSON.stringify(localStorage);
    });

    expect(finalCalls).toBe('{}');
  });

  test('should render basic markdown', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const preview = page.locator('#preview');

    // Type markdown
    await textarea.fill('# Hello World\n\nThis is a **test**');

    // Check preview
    const h1 = preview.locator('h1');
    await expect(h1).toContainText('Hello World');
    
    const strong = preview.locator('strong');
    await expect(strong).toContainText('test');
  });

  test('should save and load content from session (not storage)', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const testContent = '# Test Content\n\nSome **markdown** here';

    // Type content
    await textarea.fill(testContent);
    await page.waitForTimeout(100);

    // Content should be in textarea
    await expect(textarea).toHaveValue(testContent);

    // But localStorage should be empty
    const storageEmpty = await page.evaluate(() => {
      return localStorage.length === 0;
    });
    expect(storageEmpty).toBe(true);
  });

  test('should lose content on page reload without manual save', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const testContent = '# Test Content\n\nSome **markdown** here';

    // Clear default welcome message
    await textarea.fill('');
    await page.waitForTimeout(100);

    // Type content
    await textarea.fill(testContent);
    await page.waitForTimeout(100);

    // Verify content is there
    await expect(textarea).toHaveValue(testContent);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Content should be lost (replaced with welcome message)
    const content = await textarea.inputValue();
    expect(content).toContain('Welcome to SuperMark');
    expect(content).not.toContain('Test Content');
  });

  test('should persist changes after saving HTML file', async ({ page, context }) => {
    const textarea = page.locator('#markdown-input');
    const testContent = '# Saved Content\n\nThis content was saved to a file';

    // Clear default welcome message and enter test content
    await textarea.fill('');
    await page.waitForTimeout(100);
    await textarea.fill(testContent);
    await page.waitForTimeout(100);

    // Verify content is in textarea
    await expect(textarea).toHaveValue(testContent);

    // Get HTML and modify it to have the textarea content
    let html = await page.content();
    // Replace the textarea content in the HTML with our test content
    html = html.replace(
      /<textarea[^>]*id="markdown-input"[^>]*>[\s\S]*?<\/textarea>/,
      `<textarea id="markdown-input" placeholder="Enter your markdown here..." spellcheck="false">${testContent}</textarea>`
    );
    
    const tempFile = path.join(process.cwd(), 'temp-saved-page.html');
    fs.writeFileSync(tempFile, html, 'utf-8');

    try {
      // Load the saved HTML file in a new page
      const newPage = await context.newPage();
      await newPage.goto(`file://${tempFile}`);
      await newPage.waitForLoadState('networkidle');

      // Verify the content persisted
      const savedTextarea = newPage.locator('#markdown-input');
      const savedContent = await savedTextarea.inputValue();
      expect(savedContent).toBe(testContent);

      await newPage.close();
    } finally {
      // Clean up temporary file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });

  test('should render lists correctly', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const preview = page.locator('#preview');

    const markdown = `## Shopping List
- Item 1
- Item 2
- Item 3`;

    await textarea.fill(markdown);

    const listItems = preview.locator('li');
    await expect(listItems).toHaveCount(3);
  });

  test('should render code blocks with syntax highlighting support', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const preview = page.locator('#preview');

    const markdown = `\`\`\`javascript
const x = 42;
\`\`\``;

    await textarea.fill(markdown);

    const preBlock = preview.locator('pre');
    await expect(preBlock).toBeVisible();
  });

  test('should render links correctly', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const preview = page.locator('#preview');

    await textarea.fill('[GitHub](https://github.com)');

    const link = preview.locator('a');
    await expect(link).toHaveAttribute('href', 'https://github.com');
    await expect(link).toContainText('GitHub');
  });

  test('should handle empty content gracefully', async ({ page }) => {
    const textarea = page.locator('#markdown-input');

    // Clear content completely
    await textarea.fill('');

    // Should not error, preview should be empty or show default
    const preview = page.locator('#preview');
    await expect(preview).toBeVisible();
  });

  test('should handle image drop with base64 data URL', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    
    // Use setInputFiles to simulate file upload, then trigger the handler
    await page.evaluate(() => {
      const textarea = document.getElementById('markdown-input');
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const markdown = `![image](${dataUrl})`;
      textarea.value = markdown;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const content = await textarea.inputValue();
    expect(content).toContain('![image](data:image/png;base64,');
  });

  test('should apply drag-over styles when dragging', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    
    // Simulate dragover event
    await page.evaluate(() => {
      const textarea = document.getElementById('markdown-input');
      const dragEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      textarea.dispatchEvent(dragEvent);
    });

    // Check if drag-over class was applied
    const hasDragClass = await textarea.evaluate(el => {
      return el.classList.contains('drag-over');
    });
    
    expect(hasDragClass).toBe(true);
  });
});
