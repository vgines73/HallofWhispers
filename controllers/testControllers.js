const { Post } = require("../models");

module.exports = {
  // A simple req, res pattern that hits when you go to that url.
  test: function (req, res) {
    res.send({ msg: "success" });
  },
  // get all posts
  getPosts: async (req, res) => {
    // res.send({msg: "success from getPosts"})
    try {
      const allPosts = await Post.find().sort({
        date: -1,
      });
      // console.log(allPosts);
      res.json(allPosts);
    } catch (error) {
      console.log("error with getPosts:", error);
      res.send(error);
    }
  },
  // make a post
  createPost: async (req, res) => {
    try {
      const newPost = new Post({
        message: req.body.message,
        // date: req.body.date,
        accountId: req.account,
        chrName: req.body.chrName
      });
      res.json(await newPost.save());
    } catch (error) {
      console.log("error with createPost:", error);
    }
  },
  // get both post and account schema by using populate then sort to recent
  getPostWithAccount: async (req, res) => {
    Post.find({})
      .populate("account", "accountName")
      .sort({ date: -1 })
      .exec((err, posts) => {
        if (err) return res.status(404).json([]);
        //console.log(posts)
        const arr = posts.map((item) => {
          if (item.account._id == req.account) {
            return {
              _id: item._id,
              message: item.message,
              date: item.date,
              account: item.account.accountName,
              myAccount: "true",
            };
          } else {
            return {
              _id: item._id,
              message: item.message,
              date: item.date,
              account: item.account.accountName,
              myAccount: "false",
            };
          }
        });
        // console.log(arr)
        res.json(arr);
      });
  },
};
