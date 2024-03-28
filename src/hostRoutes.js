import express from "express";
import fs from "fs";

const router = express.Router();

// Endpoint for retrieving all hosts
router.get("/", (req, res) => {
  fs.readFile("src/data/hosts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint for creating a new host
router.post("/", (req, res) => {
  const newHost = req.body;
  fs.readFile("src/data/hosts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let hosts = JSON.parse(data);
    hosts.push(newHost);
    fs.writeFile(
      "src/data/hosts.json",
      JSON.stringify(hosts, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json(newHost);
      }
    );
  });
});

// Endpoint for retrieving a specific host by ID
router.get("/:id", (req, res) => {
  const hostId = req.params.id;
  fs.readFile("src/data/hosts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const hosts = JSON.parse(data);
    const host = hosts.find((host) => host.id === hostId);
    if (host) {
      res.json(host);
    } else {
      res.status(404).json({ error: "Host not found" });
    }
  });
});

// Endpoint for updating a host by ID
router.put("/:id", (req, res) => {
  const hostId = req.params.id;
  const updatedHost = req.body;
  fs.readFile("src/data/hosts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let hosts = JSON.parse(data);
    const hostIndex = hosts.findIndex((host) => host.id === hostId);
    if (hostIndex !== -1) {
      hosts[hostIndex] = updatedHost;
      fs.writeFile(
        "src/data/hosts.json",
        JSON.stringify(hosts, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json(updatedHost);
        }
      );
    } else {
      res.status(404).json({ error: "Host not found" });
    }
  });
});

// Endpoint for deleting a host by ID
router.delete("/:id", (req, res) => {
  const hostId = req.params.id;
  fs.readFile("src/data/hosts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let hosts = JSON.parse(data);
    const hostIndex = hosts.findIndex((host) => host.id === hostId);
    if (hostIndex !== -1) {
      hosts.splice(hostIndex, 1);
      fs.writeFile(
        "src/data/hosts.json",
        JSON.stringify(hosts, null, 2),
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
      res.status(404).json({ error: "Host not found" });
    }
  });
});

export default router;
