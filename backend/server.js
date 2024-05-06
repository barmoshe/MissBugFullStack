import express from "express";
import cors from "cors";

import { bugService } from "./services/bugService.service.js";
import { loggerService } from "./services/logger.service.js";

const app = express();
const port = process.env.PORT || 3030;

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("public"));

// Route to retrieve all bugs
app.get("/api/bug", async (req, res) => {
  try {
    const bugs = await bugService.query();
    loggerService.info(
      "Retrieved bugs successfully , number of bugs:",
      bugs.length
    );
    res.send(bugs);
  } catch (error) {
    loggerService.error("Error retrieving bugs:", error);
    res.status(500).send("Error retrieving bugs");
  }
});

// Route to save a bug
app.get("/api/bug/save", async (req, res) => {
  try {
    let bugToSave = {
      _id: req.query._id,
      title: req.query.title,
      severity: +req.query.severity,
    };
    bugToSave = await bugService.save(bugToSave);
    loggerService.info("Bug saved successfully", bugToSave._id);
    res.send(bugToSave);
  } catch (error) {
    loggerService.error("Error saving bug:", error);
    res.status(400).send("Error saving bug");
  }
});

// Route to retrieve a bug by its ID
app.get("/api/bug/:bugId", async (req, res) => {
  try {
    const bugId = req.params.bugId;
    const bug = await bugService.getById(bugId);
    if (!bug) {
      loggerService.warn("Bug not found", bugId);
      return res.status(404).send("Bug not found");
    }
    loggerService.info("Retrieved bug successfully", bug._id);
    res.send(bug);
  } catch (error) {
    loggerService.error("Error retrieving bug:", error);
    res.status(400).send("Error retrieving bug");
  }
});

// Route to remove a bug by its ID
app.get("/api/bug/:bugId/remove", async (req, res) => {
  try {
    const bugId = req.params.bugId;
    await bugService.remove(bugId);
    loggerService.info("Bug removed successfully", bugId);
    res.send("Bug removed successfully");
  } catch (error) {
    loggerService.error("Error removing bug:", error);
    res.status(500).send("Error removing bug");
  }
});

app.listen(port, () => {
  loggerService.info(`Server is running on http://localhost:${port}`);
});
