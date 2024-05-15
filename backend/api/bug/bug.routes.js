import express from "express";
import {
  addBug,
  getBug,
  getBugs,
  removeBug,
  updateBug,
} from "./bug.controller.js";
import { trackVisitedBugs } from "../../middleware/visitedBugs.middleware.js";
import { logRequests } from "../../middleware/logger.middleware.js";

const router = express.Router();

router.get("/", logRequests, getBugs);
router.get("/:bugId", logRequests, trackVisitedBugs, getBug);
router.delete("/:bugId", logRequests, removeBug);
router.put("/:bugId", logRequests, updateBug);
router.post("/", logRequests, addBug);

export const bugRoutes = router;
