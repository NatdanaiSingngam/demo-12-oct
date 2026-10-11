import { existsSync } from 'node:fs';
import app from './app';

// Local API for `npm run dev:api`; Vite proxies /api to this port. Vercel uses api/index.ts instead.
for (const file of ['.env.local', '.env']) if (existsSync(file)) process.loadEnvFile(file);
const port = Number(process.env.API_PORT || 3001);
app.listen(port, '127.0.0.1', () => console.log(`API listening on http://127.0.0.1:${port}`));
