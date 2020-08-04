const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (title === undefined || contents === undefined)
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  db.insert(req.body)
    .then((dbRes) => res.status(201).json(req.body))
    .catch((err) =>
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      })
    );
});

router.post("/:id/comments", (req, res) => {
  const { text } = req.body;
  db.findById(req.params.id)
    .then((postFound) => {
      if (postFound.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }
      if (text === undefined) {
        res
          .status(404)
          .json({ errorMessage: "Please provide text for the comment." });
        return;
      }
      let newBody = req.body;
      newBody.post_id = req.params.id;
      console.log(`Inserting new comment: ${newBody.text}`);
      db.insertComment(newBody)
        .then((dbRes) => {
          res.status(201).json(req.body);
        })
        .catch((err) =>
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database",
          })
        );
    })
    .catch((err) => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.get("/", (req, res) => {
  db.find()
    .then((dbRes) => res.send(dbRes))
    .catch((err) =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((dbRes) => {
      if (dbRes.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }
      res.send(dbRes);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

router.get("/:id/comments", (req, res) => {
  db.findById(req.params.id)
    .then((dbRes) => {
      if (dbRes.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }

      db.findPostComments(req.params.id)
        .then((dbRes) => {
          res.send(dbRes);
        })
        .catch((err) => {
          res.status(500).json({
            error: "The comments information could not be retrieved.",
          });
        });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

router.delete("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }
      db.remove(req.params.id)
        .then((dbRes) => {
          res.send(post);
        })
        .catch((err) => {
          res.status(500).json({ error: "The post could not be removed" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  db.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }

      if (title === undefined || contents === undefined) {
        res
          .status(400)
          .json({
            errorMessage: "Please provide title and contents for the post.",
          });
        return;
      }

      db.update(req.params.id, req.body)
        .then((dbRes) => {
          res.status(200).json(req.body);
        })
        .catch((err) => {
          res
            .status(500)
            .json({ error: "The post information could not be modified." });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
