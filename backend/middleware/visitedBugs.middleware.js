// middleware/visitedBugs.js
import { loggerService } from "../services/logger.service.js";

// Helper function to retrieve visited bugs from the cookie
export function getVisitedBugsFromCookie(req) {
  return JSON.parse(req.cookies.visitedBugs || "[]");
}

// Helper function to update visited bugs in the cookie
export function updateVisitedBugsCookie(res, visitedBugs) {
  res.cookie("visitedBugs", JSON.stringify(visitedBugs), { maxAge: 7 * 1000 });
}

// Middleware to track visited bugs
export function trackVisitedBugs(req, res, next) {
  let visitedBugs = getVisitedBugsFromCookie(req);
  if (visitedBugs.includes(req.params.bugId)) {
    return res.status(400).send("Bug already visited");
  }
  if (hasExceededBugLimit(visitedBugs)) {
    loggerService.warn("User exceeded the limit of 3 visited bugs");
    return res.status(401).send("User exceeded the limit of 3 visited bugs");
  }

  visitedBugs.push(req.params.bugId);
  updateVisitedBugsCookie(res, visitedBugs);
  loggerService.info("visitedBugs:", visitedBugs);
  next();
}

// Helper function to check if the user has visited more than 3 bugs
export function hasExceededBugLimit(visitedBugs) {
  return visitedBugs.length >= 3;
}
