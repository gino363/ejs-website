const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const { render } = require("ejs");
const nodemon = require("nodemon");
const path = require("path");
const User = require("./models/user");
require('dotenv').config();

const app = express();

app.use(express.json());

// connect to mongodb



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (local) 👍"))
  .catch(err => console.log(err));

app.listen(3000);

app.set("view engine", "ejs");





// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname,'views'));

app.use(morgan("dev"));

// mongoose and mongo sandbox routes




//app.get("/login", (_req, res) => {
  //  res.render("/login", { error: null });
 // });

app.get("/add-blog", (_req, res) => {
    const blog = new Blog({
        title: "new blog hello gino",
        snippet: "about my new blog ok",
        body: "more about my new blog",
    });
    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/blogs/create", (_req, res) => {
    res.render("create", { title: "Create " });
});

app.get("/all-blogs", (_req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/single-blog", (_req, res) => {
    Blog.findById("62db7a81fe67012ff5161513")
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

// routes
app.get("/", (_req, res) => {
    res.redirect("/blogs");
});

app.get("/login", (_req, res) => {
    res.render("login", { title: "Login" });
});

app.get("/register", (_req, res) => {
    res.render("register", { title: "Register" });
});

// blog routes

app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render("details", { blog: result, title: "Blog Details" });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/blogs", (_req, res) => {
    Blog.find()
        .sort({ createdAt: -1 })
        .then((result) => {
            res.render("index", { title: "All Blogs", blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/blogs", (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((_result) => {
            res.redirect("/blogs");
        })
        .catch((err) => {
            console.log(err);
        });
});






// Register route
app.post('/register', async (req, res) => {
    try {
      const { username,email, password } = req.body;
      const newUser = new User({ username,email, password });
      await newUser.save();
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send('Registration failed');
    }
  });



// Login route
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
         if (user && await(password, user.password)) {
        res.redirect('/blogs'); // or your dashboard
      } else {
        res.send('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Login failed');
    }
  });



  //404 page
app.use((_req, res) => {
    res.status(404).render("404", { title: "404" });

});




