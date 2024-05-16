import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { bugRoutes } from "./api/bug/bug.routes.js";
import { userRoutes } from "./api/user/user.routes.js";
import { authRoutes } from "./api/auth/auth.routes.js";
import { loggerService } from "./services/logger.service.js";

const app = express();
const port = process.env.PORT || 3030;

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

app.get("/api/logs", async (req, res) => {
  res.sendFile(process.cwd() + "/logs/backend.log");
});
app.use("/api/bug", bugRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  loggerService.info(`Server is running on http://localhost:${port}`);
});
