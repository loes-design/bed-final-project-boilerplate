import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import hostRoutes from "./hostRoutes.js";
import propertyRoutes from "./propertyRoutes.js";
import amenityRoutes from "./amenityRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const app = express();
app.use(bodyParser.json());

// Middleware for handling HTTP status codes
app.use((req, res, next) => {
  res.success = (data) => {
    res.status(200).json(data);
  };
  res.created = (data) => {
    res.status(201).json(data);
  };
  res.notFound = () => {
    res.status(404).json({ error: "Not Found" });
  };
  res.unauthorized = () => {
    res.status(401).json({ error: "Unauthorized" });
  };
  res.internalServerError = (error) => {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  };
  next();
});

// Use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/properties", propertyRoutes);
app.use("/amenities", amenityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the online booking app!");
});
