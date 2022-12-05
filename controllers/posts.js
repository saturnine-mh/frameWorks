const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comments = require("../models/Comments");
const fetch = require("node-fetch");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comment = await Comments.find({postID: req.params.id});
      console.log(comment, 'hola senor')
      res.render("post.ejs", { post: post, user: req.user, comments: comment});
    } catch (err) {
      console.log(err);
    }
  },
  
  getAlbums: async (req, res) => {
    try {
      console.log(req.params.album)
      
      const posts = await Post.find({album: req.params.album});
      const comment = await Comments.find({postID: req.params.id});
      console.log('album test', posts)
      console.log(comment, 'hola senor')
      res.render("albums.ejs", { posts: posts, user: req.user, comments: comment});
    } catch (err) {
      console.log(err);
    }
  },

  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      let imageID = result.secure_url
      let qualityParam = req.body.title
      let albumLowerCase = req.body.album.toLowerCase()
      let albumProperCase = albumLowerCase.charAt(0).toUpperCase() + albumLowerCase.slice(1);
      console.log(albumProperCase)
      const response = await fetch(`http://api.resmush.it/ws.php?img=${imageID}&qlty=${qualityParam}`);
      const body = await response.json();
      console.log(body, imageID, response)
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        album: albumProperCase,
        name: req.body.name,
        originalSize: body.src_size,
        compressedSize: body.dest_size,
        compressedURL: body.dest,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },



  createComment: async (req, res) => {
   
    try {
      let userComment = req.user.id + ' Says: ' + req.body.comments
      // create a comment
      await Comments.create({
        comments: userComment,
        user: req.user.id,
        postID: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err, 'error');
      res.redirect(`/post/${req.params.id}`);
    }
  },

  // createComment: async (req, res) => {
  //   let comment = ''
  //   comment = req.user.id + ' Says: ' + req.body.comments
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $set: { comments: comment },
  //       }
  //     );
  //     console.log(`Comment Made!`);
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err, 'error');
  //     res.redirect(`/post/${req.params.id}`);
  //   }
  // },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

  deleteComment: async (req, res) => {
    try {
      // Find post by id
      await Post.findById({ _id: req.params.id });
      const comment = await Comments.findOne({_id: req.params.id});
      const postID = comment.postID
      // Delete post from db
      console.log(`looking at comment ${comment}`)
      console.log(`delete comment ${req.params.id}`)


      await Comments.deleteOne({_id: req.params.id });
// takes comment id from the EJS targetted via comments[i].id

      console.log("Deleted Comment");
      res.redirect(`/post/${postID}`);
    } catch (err) {
      console.log('delete 404')
      res.redirect("/profile");
    }
  },

  



};


