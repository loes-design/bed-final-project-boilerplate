import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import winston from "winston";
import * as Sentry from "@sentry/node";

const router = express.Router();

// Middleware for authentication token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Logging setup
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error to Sentry
  Sentry.captureException(err);

  // Send generic client-facing error message
  res.status(500).json({
    error: "An error occurred on the server, please try again later.",
  });
};

// Apply middleware for request duration logging
const requestDurationLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
};

// Apply middleware
router.use(requestDurationLogger);
router.use(errorHandler);

// Endpoint for retrieving all users
router.get("/", (req, res) => {
  fs.readFile("src/data/users.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint for retrieving a specific user based on ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  fs.readFile("src/data/users.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const users = JSON.parse(data);
    const user = users.find((user) => user.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Endpoint for updating a user based on ID
router.put("/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  fs.readFile("src/data/users.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUserData };
      fs.writeFile(
        "src/data/users.json",
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json(users[userIndex]);
        }
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Endpoint for creating a new user
router.post("/", authenticateToken, (req, res) => {
  const newUser = req.body;
  fs.readFile("src/data/users.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let users = JSON.parse(data);
    users.push(newUser);
    fs.writeFile(
      "src/data/users.json",
      JSON.stringify(users, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json(newUser);
      }
    );
  });
});

// Endpoint for deleting a user based on ID
router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;
  fs.readFile("src/data/users.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      fs.writeFile(
        "src/data/users.json",
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.sendStatus(204);
        }
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

export default router;
