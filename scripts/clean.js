import fs from 'fs';
import path from 'path';

const dirsToRemove = ['dist', 'playwright-report', 'test-results'];
const filesToRemove = ['test-output.txt'];

const baseDir = new URL('..', import.meta.url).pathname.slice(1);

[...dirsToRemove, ...filesToRemove].forEach((item) => {
  const fullPath = path.join(baseDir, item);
  try {
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Removed: ${item}`);
    }
  } catch (err) {
    console.error(`Failed to remove ${item}:`, err.message);
  }
});

console.log('Clean complete!');
