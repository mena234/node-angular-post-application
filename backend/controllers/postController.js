const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const pageNumber = +req.query.pageNumber;
  const pageSize = +req.query.pageSize;
  const postQuery = Post.find();
  let documents;
  if (pageNumber && pageSize) {
    postQuery.skip(pageSize * (pageNumber - 1)).limit(pageSize);
    console.log("done here");
  }
  postQuery
    .then((posts) => {
      documents = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Have Been Fetched Successfuly",
        posts: documents,
        count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn Not Fetch The Posts",
      });
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.id;
  Post.findOne({ _id: postId }).then((post) => {
    res.status(200).json({
      message: "Post Has Been Fetched Successfuly",
      post: post,
    });
  });
};

exports.addPost = (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;
  const userId = req.userData.userId;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: userId,
  });
  post
    .save()
    .then((postData) => {
      res.status(201).json({
        postId: {
          ...postData,
          id: postData._id,
        },
        message: "Post Has Been Added Sueccessfuly",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could Not Fetch The Post",
      });
    });
};

exports.editPost = (req, res, next) => {
  const postId = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  let imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get("host")}`;
    imagePath = `${url}/images/${req.file.filename}`;
  } else {
    imagePath = req.body.image;
  }

  const post = new Post({
    _id: postId,
    title,
    content,
    imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: postId, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "The Post Edited Successfuly",
        });
      } else {
        res.status(401).json({
          message: "You Arenot Authoraized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Edit Has Been Failed",
      });
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;
  Post.deleteOne({ _id: postId, creator: req.userData.userId })
    .then((result) => {
      if (result.n) {
        res.status(200).json({
          message: "Post Has Been Deleted",
        });
      } else {
        res.status(401).json({
          message: "You Are not Authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete Post Has Been Failed",
      });
    });
};
