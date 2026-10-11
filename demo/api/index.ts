// Vercel Function entry: every /api/* request is rewritten here (see vercel.json).
// The explicit .js extension is required: the project is "type": "module" and Node's ESM resolver
// does not guess extensions at runtime (TypeScript still resolves it to server/app.ts).
export { default } from '../server/app.js';
