const express = require("express");
const routes = express();
const checkAuth = require("../middlewares/check-auth");
const postController = require("../controllers/postController");

routes.get("", postController.getPosts);

routes.get("/:id", postController.getPost);

routes.post("", checkAuth, postController.addPost);

routes.put("/:id", checkAuth, postController.editPost);

routes.delete("/:id", checkAuth, postController.deletePost);

module.exports = routes;
