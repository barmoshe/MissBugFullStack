// middleware/logger.js
import { loggerService } from "../services/logger.service.js";
export function logErrors(err, req, res, next) {
  loggerService.error("Error:", err);
  next(err);
}

export function logRequests(req, res, next) {
  loggerService.info("Request:", req.method, req.url);
  next();
}
