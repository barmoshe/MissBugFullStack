import express from "express";
import {
  getUser,
  getUsers,
  removeUser as deleteUser,
  updateUser,
  addUser,
} from "./user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.post("/", addUser);
router.delete("/:id", deleteUser);

export const userRoutes = router;
