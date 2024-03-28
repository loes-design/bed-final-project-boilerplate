import express from "express";
import fs from "fs";
import Sentry from "@sentry/node";

const router = express.Router();

// JWT authentication middleware
router.use((req, res, next) => {
  // Implement JWT authentication logic here
  // If authentication fails, return 401 Unauthorized
  next();
});

// Endpoint voor het ophalen van alle amenities
router.get("/", (req, res) => {
  fs.readFile("src/data/amenities.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint voor het maken van een nieuwe amenity
router.post("/", (req, res) => {
  const newAmenity = req.body;
  fs.readFile("src/data/amenities.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let amenities = JSON.parse(data);
    amenities.push(newAmenity);
    fs.writeFile(
      "src/data/amenities.json",
      JSON.stringify(amenities, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json(newAmenity);
      }
    );
  });
});

// Endpoint voor het ophalen van een specifieke amenity op basis van ID
router.get("/:id", (req, res) => {
  const amenityId = req.params.id;
  fs.readFile("src/data/amenities.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const amenities = JSON.parse(data);
    const amenity = amenities.find((amenity) => amenity.id === amenityId);
    if (amenity) {
      res.json(amenity);
    } else {
      res.status(404).json({ error: "Amenity not found" });
    }
  });
});

// Endpoint voor het bijwerken van een amenity op basis van ID
router.put("/:id", (req, res) => {
  const amenityId = req.params.id;
  const updatedAmenity = req.body;
  fs.readFile("src/data/amenities.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let amenities = JSON.parse(data);
    const amenityIndex = amenities.findIndex(
      (amenity) => amenity.id === amenityId
    );
    if (amenityIndex !== -1) {
      amenities[amenityIndex] = updatedAmenity;
      fs.writeFile(
        "src/data/amenities.json",
        JSON.stringify(amenities, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json(updatedAmenity);
        }
      );
    } else {
      res.status(404).json({ error: "Amenity not found" });
    }
  });
});

// Endpoint voor het verwijderen van een amenity op basis van ID
router.delete("/:id", (req, res) => {
  const amenityId = req.params.id;
  fs.readFile("src/data/amenities.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let amenities = JSON.parse(data);
    const amenityIndex = amenities.findIndex(
      (amenity) => amenity.id === amenityId
    );
    if (amenityIndex !== -1) {
      amenities.splice(amenityIndex, 1);
      fs.writeFile(
        "src/data/amenities.json",
        JSON.stringify(amenities, null, 2),
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
      res.status(404).json({ error: "Amenity not found" });
    }
  });
});

export default router;
