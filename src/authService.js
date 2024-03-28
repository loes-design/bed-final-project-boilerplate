import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Endpoint for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await userRoutes.getUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint for user registration
router.post("/register", async (req, res) => {
  const { username, password, name, email, phoneNumber } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userRoutes.getUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ error: "Username is already in use" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user to the database
    const newUser = {
      username,
      password: hashedPassword,
      name,
      email,
      phoneNumber,
    };
    await userRoutes.addUser(newUser);

    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
