require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/blogDB")
mongoose.connect(process.env.mongoose_atlas_connection_link)

const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Post = mongoose.model('Post', postsSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.get('/', (req, res) => {

  Post.find({}, (err, posts) => {
    if (!err) {
      res.render('home', {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    }
  });

});

// this is "express route parameters"
app.get('/posts/:postId', (req, res) => {
  // converting to lowerCase using lodash, because url might have hyphens separating the words
  const postId = req.params.postId;

  // checking if the title put in url, is available in the lists of posts
  Post.findById(postId, (err, post) => {
    if (!err) {
      res.render('post', {
        id: postId,
        title: post.title,
        content: post.content
      });
    }
  });

});

app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent,
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent,
  });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
  });

  await newPost.save();

  res.redirect("/");

});

app.post('/delete', async (req, res) => {
  const postId = req.body.deleteButton;

  Post.findByIdAndRemove(postId, function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);