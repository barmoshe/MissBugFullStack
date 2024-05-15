import { bugService } from "./bug.service.js";
import { loggerService } from "../../services/logger.service.js";
import {
  getVisitedBugsFromCookie,
  updateVisitedBugsCookie,
} from "../../middleware/visitedBugs.middleware.js";
import { hasExceededBugLimit } from "../../middleware/visitedBugs.middleware.js";

export async function getBugs(req, res) {
  const { pageIdx, txt, severity, sortBy } = req.query;

  try {
    const bugs = await bugService.query({ txt, severity }, sortBy, +pageIdx);
    res.send(bugs);
  } catch (error) {
    if (error.message === "Invalid page index") {
      return res.status(400).send("Invalid page index");
    }
    res.status(500).send({ error: error.message });
  }
}

export async function getBug(req, res) {
  try {
    const { bugId } = req.params;
    const bug = await bugService.getById(bugId);
    if (!bug) {
      loggerService.warn("Bug not found:", bugId);
      return res.status(404).send("Bug not found");
    }
    loggerService.info("Bug retrieved successfully:", bugId);
    res.send(bug);
  } catch (error) {
    loggerService.error("Error retrieving bug:", error);
    res.status(500).send("Error retrieving bug");
  }
}

export async function removeBug(req, res) {
  try {
    const { bugId } = req.params;
    await bugService.remove(bugId);
    loggerService.info("Bug removed successfully:", bugId);
    res.send("Bug removed successfully");
  } catch (error) {
    loggerService.error("Error removing bug:", error);
    res.status(500).send("Error removing bug");
  }
}

export async function updateBug(req, res) {
  const { bug } = req.body;
  try {
    const savedBug = await bugService.save(bug);
    loggerService.info("Bug updated successfully:", savedBug._id);
    res.send(savedBug);
  } catch (error) {
    loggerService.error("Error updating bug:", error);
    res.status(400).send("Error updating bug");
  }
}

export async function addBug(req, res) {
  const { bug } = req.body;
  try {
    const savedBug = await bugService.save(bug);
    loggerService.info("Bug added successfully:", savedBug._id);
    res.send(savedBug);
  } catch (error) {
    loggerService.error("Error adding bug:", error);
    res.status(400).send("Error adding bug");
  }
}
