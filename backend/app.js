const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { User, Like } = require("./model/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;

mongoose.connect(
  "mongodb+srv://hjds760781:12345yuiop@cluster0.i6kcvj3.mongodb.net/user?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/login", async (req, res) => {
  const data = req.body;
  const { email, password } = data;
  if (!email || !password) {
    res.status(400).send({ message: "Please enter all fields" });
  } else {
    const userdata = await User.findOne({ email });
    if (userdata && password === userdata.password) {
      const user = { id: userdata.id, email: userdata.email }; // Customize this with the user data you want to include
      const accessToken = jwt.sign(user, process.env.JWT_SECRET);
      // //console.log(accessToken);
      res.json({ token: accessToken });
      // res.status(200).send(userdata);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  }
});
app.post("/logout", async (req, res) => {});
app.post("/signup", async (req, res) => {
  const data = req.body;
  const { name, email, password, confirmPassword } = data;
  if (!name || !email || !password || !confirmPassword) {
    res.status(400).send({ message: "Please enter all fields" });
  } else {
    if (!(password === confirmPassword)) {
      res.status(401).send({ message: "Passwords do not match" });
    } else {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          res.status(409).send({ message: "Email already exists" });
        } else {
          const newUser = new User({ name, email, password, confirmPassword });
          await newUser.save();
          res.status(201).send({ message: "User registered successfully" });
        }
      } catch (error) {
        console.error("Error while registering user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    }
  }
});
// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const authtoken = token.split(" ")[1];
  jwt.verify(authtoken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.userId = user.Id;
    next();
  });
}
// Like route

// Backend route example (Node.js with Express.js and MongoDB)
app.get("/like/count", async (req, res) => {
  try {
    const count = await Like.countDocuments({});
    res.json({ likeCount: count });
    //console.log(count);
  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/generate", (req, res) => {
  console.log(req.body);
});
app.post("/like", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId; // This is the authenticated user's ID
    const userEmail = req.body.email;
    // Check if the user has already liked
    const existingLike = await Like.findOne({ user: userId });

    if (existingLike) {
      return res.status(400).json({ message: "User already liked" });
    }
    const userLike = new Like({
      user: userId,
      email: userEmail,
    });

    await userLike.save();

    const user = await User.findOne({ _id: userId });
    user.likeCount += 1; // Increment the like count
    await user.save();

    res.status(201).json({ message: "Like incremented successfully" });
  } catch (error) {
    console.error("Error incrementing like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
