import express from "express";
import {
  addCar,
  getCar,
  getCars,
  removeCar,
  updateCar,
} from "./car.controller.js";
import { log } from "../../middlewares/log.middleware.js";
import { requireUser } from "../../middleware/requireAuth.middleware.js";

const router = express.Router();

router.get("/", log, getCars);
router.get("/:carId", log, getCar);
router.delete("/:carId", log, requireUser, removeCar);
router.post("/", log, requireUser, addCar);
router.put("/", log, requireUser, updateCar);

export const carRoutes = router;
