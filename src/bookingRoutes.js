import express from "express";
import fs from "fs";

const router = express.Router();

// Endpoint for retrieving all bookings
router.get("/", (req, res) => {
  fs.readFile("src/data/bookings.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint for creating a new booking
router.post("/", (req, res) => {
  const newBooking = req.body;
  fs.readFile("src/data/bookings.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let bookings = JSON.parse(data);
    bookings.push(newBooking);
    fs.writeFile(
      "src/data/bookings.json",
      JSON.stringify(bookings, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json(newBooking);
      }
    );
  });
});

// Endpoint for retrieving a specific booking by ID
router.get("/:id", (req, res) => {
  const bookingId = req.params.id;
  fs.readFile("src/data/bookings.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const bookings = JSON.parse(data);
    const booking = bookings.find((booking) => booking.id === bookingId);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  });
});

// Endpoint for updating a booking by ID
router.put("/:id", (req, res) => {
  const bookingId = req.params.id;
  const updatedBooking = req.body;
  fs.readFile("src/data/bookings.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let bookings = JSON.parse(data);
    const bookingIndex = bookings.findIndex(
      (booking) => booking.id === bookingId
    );
    if (bookingIndex !== -1) {
      bookings[bookingIndex] = updatedBooking;
      fs.writeFile(
        "src/data/bookings.json",
        JSON.stringify(bookings, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json(updatedBooking);
        }
      );
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  });
});

// Endpoint for deleting a booking by ID
router.delete("/:id", (req, res) => {
  const bookingId = req.params.id;
  fs.readFile("src/data/bookings.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let bookings = JSON.parse(data);
    const bookingIndex = bookings.findIndex(
      (booking) => booking.id === bookingId
    );
    if (bookingIndex !== -1) {
      bookings.splice(bookingIndex, 1);
      fs.writeFile(
        "src/data/bookings.json",
        JSON.stringify(bookings, null, 2),
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
      res.status(404).json({ error: "Booking not found" });
    }
  });
});

export default router;
