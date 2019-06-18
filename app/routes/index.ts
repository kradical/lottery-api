import express from 'express';

import root from '../controllers/root';
import notFound from '../controllers/notfound';

const router = express.Router();

// Routes
router.get('/', root);

// Fall Through Route
router.use(notFound);

export default router;
