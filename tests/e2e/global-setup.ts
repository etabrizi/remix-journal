import { spawn } from 'child_process';
import path from 'path';
import http from 'http';

// Start Remix dev server before tests. Assumes npm install already ran.
async function waitForServer(url: string, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, res => {
          res.destroy();
          resolve(null);
        });
        req.on('error', reject);
      });
      return;
    } catch (_) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  throw new Error(`Server not reachable at ${url} within ${timeoutMs}ms`);
}

let serverProc: ReturnType<typeof spawn> | null = null;

async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  if (!process.env.PLAYWRIGHT_SKIP_SERVER) {
    serverProc = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: '3000', USE_MSW: process.env.USE_MSW ?? 'true' },
      shell: process.platform === 'win32'
    });
    process.env.PLAYWRIGHT_SERVER_PID = String(serverProc.pid);
    await waitForServer(baseURL);
  }
}

async function globalTeardown() {
  if (serverProc) {
    serverProc.kill('SIGTERM');
  }
}

export default globalSetup;
export { globalTeardown };
