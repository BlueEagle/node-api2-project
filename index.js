const express = require("express");
const server = express();

const postsRouter = require("./routers/posts-router");

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Try endpoints starting with: /api/posts");
});

server.use("/api/posts", postsRouter);

server.listen(4000, () =>
  console.log(`Server listening at http://localhost:4000`)
);
