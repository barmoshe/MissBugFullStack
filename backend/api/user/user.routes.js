import express from "express";
import {
  getUser,
  getUsers,
  removeUser as deleteUser,
  updateUser,
  addUser,
} from "./user.controller.js";
import { logRequests } from "../../middleware/logger.middleware.js";

const router = express.Router();

router.get("/", logRequests, getUsers);
router.get("/:id", logRequests, getUser);
router.put("/:id", logRequests, updateUser);
router.post("/", logRequests, addUser);
router.delete("/:id", logRequests, deleteUser);

export const userRoutes = router;

// router.get("/", getUsers);
// router.get("/:id", getUser);
// router.put("/:id", updateUser);
// router.post("/", addUser);
// router.delete("/:id", deleteUser);

// export const userRoutes = router;
