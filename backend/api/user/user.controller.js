import { userService } from "./user.service.js";
import { loggerService } from "../../services/logger.service.js";

export async function getUsers(req, res) {
  const { pageIdx, txt, sortBy } = req.query;
  console.log("req.query:", req.query);
  try {
    const users = await userService.query({ txt }, sortBy, +pageIdx);
    res.send(users);
  } catch (error) {
    loggerService.error("Error retrieving users:", error);
    res.status(500).send("Error retrieving users");
  }
}

export async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await userService.getById(userId);
    if (!user) {
      loggerService.warn("User not found:", userId);
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    loggerService.error("Error retrieving user:", error);
    res.status(500).send("Error retrieving user");
  }
}

export async function removeUser(req, res) {
  try {
    const { id } = req.params;
    await userService.remove(userId);
    loggerService.info("User removed successfully:", userId);
    res.send("User removed successfully");
  } catch (error) {
    loggerService.error("Error removing user:", error);
    res.status(500).send("Error removing user");
  }
}

export async function updateUser(req, res) {
  const { user } = req.body;
  try {
    const updatedUser = await userService.save(user);
    loggerService.info("User updated successfully:", updatedUser._id);
    res.send(updatedUser);
  } catch (error) {
    loggerService.error("Error updating user:", error);
    res.status(400).send("Error updating user");
  }
}

export async function addUser(req, res) {
  const { user } = req.body;
  console.log("user", user);
  try {
    const newUser = await userService.save(user);
    loggerService.info("User added successfully:", newUser._id);
    res.send(newUser);
  } catch (error) {
    loggerService.error("Error adding user:", error);
    res.status(400).send("Error adding user");
  }
}
