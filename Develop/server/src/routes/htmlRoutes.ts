import * as path from 'node:path';
import { Router } from 'express';
const router = Router();

// Serve index.html for all routes
router.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../../client/dist/index.html'));
});

export default router;
