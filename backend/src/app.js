const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const organizationRoutes = require("./routes/organization.routes");
const teamRoutes = require("./routes/team.routes");
const projectRoutes = require("./routes/project.routes");
const errorMiddleware = require("./middlewares/error.middleware"); // for error handling
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CollabAI Backend Running",
  });
});

app.use(errorMiddleware);

module.exports = app;