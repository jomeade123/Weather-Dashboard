import * as path from 'node:path';
import { Router } from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve index.html for all routes
router.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../../client/dist/index.html'));
});

export default router;
