import { AsyncRouter } from "express-async-router";

import root from "../controllers/root";
import notfound from "../controllers/notfound";
import winnings from "../controllers/winnings";

// Lets us use async fns as route handlers
const router = AsyncRouter();

// Routes
router.get("/", root);
router.post("/winnings", winnings);

// Fall Through Route
router.use(notfound);

export default router;
