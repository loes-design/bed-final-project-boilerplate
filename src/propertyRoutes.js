import express from "express";
import fs from "fs";

const router = express.Router();

// Endpoint for retrieving all properties
router.get("/", (req, res) => {
  fs.readFile("src/data/properties.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint for creating a new property
router.post("/", (req, res) => {
  const newProperty = req.body;
  fs.readFile("src/data/properties.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let properties = JSON.parse(data);
    properties.push(newProperty);
    fs.writeFile(
      "src/data/properties.json",
      JSON.stringify(properties, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json(newProperty);
      }
    );
  });
});

// Endpoint for retrieving a specific property based on ID
router.get("/:id", (req, res) => {
  const propertyId = req.params.id;
  fs.readFile("src/data/properties.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const properties = JSON.parse(data);
    const property = properties.find((property) => property.id === propertyId);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  });
});

// Endpoint for updating a property based on ID
router.put("/:id", (req, res) => {
  const propertyId = req.params.id;
  const updatedProperty = req.body;
  fs.readFile("src/data/properties.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let properties = JSON.parse(data);
    const propertyIndex = properties.findIndex(
      (property) => property.id === propertyId
    );
    if (propertyIndex !== -1) {
      properties[propertyIndex] = updatedProperty;
      fs.writeFile(
        "src/data/properties.json",
        JSON.stringify(properties, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json(updatedProperty);
        }
      );
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  });
});

// Endpoint for deleting a property based on ID
router.delete("/:id", (req, res) => {
  const propertyId = req.params.id;
  fs.readFile("src/data/properties.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let properties = JSON.parse(data);
    const propertyIndex = properties.findIndex(
      (property) => property.id === propertyId
    );
    if (propertyIndex !== -1) {
      properties.splice(propertyIndex, 1);
      fs.writeFile(
        "src/data/properties.json",
        JSON.stringify(properties, null, 2),
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
      res.status(404).json({ error: "Property not found" });
    }
  });
});

export default router;
