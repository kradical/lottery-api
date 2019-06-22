import express from "express";

import root from "../controllers/root";
import notfound from "../controllers/notfound";
import winnings from "../controllers/winnings";

const router = express.Router();

// Routes
router.get("/", root);
router.post("/winnings", winnings);

// Fall Through Route
router.use(notfound);

export default router;
