import { authService } from "../api/auth/auth.service.js";
import { loggerService } from "./../services/logger.service.js";

export function requireUser(req, res, next) {
  const loggedinUser = authService.validateToken(req.cookies.loginToken);
  if (!loggedinUser) return res.status(401).send("Not authenticated");

  req.loggedinUser = loggedinUser;
  next();
}

export function requireAdmin(req, res, next) {
  const loggedinUser = authService.validateToken(req.cookies.loginToken);
  if (!loggedinUser) return res.status(403).send("Not authenticated");
  if (!loggedinUser.isAdmin) {
    console.log(loggedinUser, "tried to perform an admin action");
    loggerService.warn(
      `${loggedinUser.fullname} tried to perform an admin action`
    );
    return res.status(401).send(`Not autorized`);
  }

  req.loggedinUser = loggedinUser;
  next();
}
