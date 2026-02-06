import { test, expect } from '@playwright/test';

test.describe('Markdown Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('SuperMark');
  });

  test('should display correct header text', async ({ page }) => {
    const header = page.locator('header h1');
    await expect(header).toContainText('SuperMark');
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

  test('should save and load content from localStorage', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const testContent = '# Test Content\n\nSome **markdown** here';

    // Type content
    await textarea.fill(testContent);
    await page.waitForTimeout(100);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify content is restored
    await expect(textarea).toHaveValue(testContent);
  });

  test('should update preview in real-time', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const preview = page.locator('#preview');

    await textarea.fill('');
    await textarea.type('## Heading 2');
    
    const h2 = preview.locator('h2');
    await expect(h2).toContainText('Heading 2');
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

  test('should auto-save on input change', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    const testContent = 'Auto-save test';

    await textarea.fill(testContent);
    await page.waitForTimeout(100);

    // Check localStorage directly
    const savedContent = await page.evaluate(() => {
      return localStorage.getItem('markdown-content');
    });

    expect(savedContent).toBe(testContent);
  });
});
