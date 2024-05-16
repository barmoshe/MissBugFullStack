import express from "express";
import {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} from "./user.controller.js";
import { logRequests } from "../../middleware/logger.middleware.js";
import { requireAdmin } from "../../middleware/requireAuth.middleware.js";

const router = express.Router();

router.get("/", logRequests, requireAdmin, getUsers);
router.get("/:id", logRequests, getUser);
router.delete("/:id", logRequests, requireAdmin, deleteUser);
router.put("/:id", logRequests, requireAdmin, updateUser);
export const userRoutes = router;
