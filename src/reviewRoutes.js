import express from "express";
import fs from "fs";

const router = express.Router();

// Endpoint for retrieving all reviews
router.get("/", (req, res) => {
  fs.readFile("src/data/reviews.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint for creating a new review
router.post("/", (req, res) => {
  const newReview = req.body;
  fs.readFile("src/data/reviews.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let reviews = JSON.parse(data);
    reviews.push(newReview);
    fs.writeFile(
      "src/data/reviews.json",
      JSON.stringify(reviews, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(201).json(newReview);
      }
    );
  });
});

// Endpoint for retrieving a specific review based on ID
router.get("/:id", (req, res) => {
  const reviewId = req.params.id;
  fs.readFile("src/data/reviews.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const reviews = JSON.parse(data);
    const review = reviews.find((review) => review.id === reviewId);
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  });
});

// Endpoint for updating a review based on ID
router.put("/:id", (req, res) => {
  const reviewId = req.params.id;
  const updatedReview = req.body;
  fs.readFile("src/data/reviews.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let reviews = JSON.parse(data);
    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
    if (reviewIndex !== -1) {
      reviews[reviewIndex] = updatedReview;
      fs.writeFile(
        "src/data/reviews.json",
        JSON.stringify(reviews, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json(updatedReview);
        }
      );
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  });
});

// Endpoint for deleting a review based on ID
router.delete("/:id", (req, res) => {
  const reviewId = req.params.id;
  fs.readFile("src/data/reviews.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let reviews = JSON.parse(data);
    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
    if (reviewIndex !== -1) {
      reviews.splice(reviewIndex, 1);
      fs.writeFile(
        "src/data/reviews.json",
        JSON.stringify(reviews, null, 2),
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
      res.status(404).json({ error: "Review not found" });
    }
  });
});

export default router;
