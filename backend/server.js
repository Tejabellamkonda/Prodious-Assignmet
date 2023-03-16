const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDb = require("./config/db");
const User = require("./models/userModel");
const Todo = require("./models/todoModel");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
connectDb();

const protect = async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = request.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      request.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      response.send("UnAuthorised");
    }
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

app.post("/register", async (request, response) => {
  const { name, email, password } = request.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    response.status(400).json({
      message: "User Already Exists",
    });
  } else {
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      response.status(201).json({ usermessage: "Registered Successfully" });
    } else {
      response.status(400);
    }
  }
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  console.log(email, password);

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    response.status(201).json({
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    response.status(400).json({
      message: "Invalid Email or Password",
    });
  }
});

app.get("/", protect, async (request, response) => {
  const todos = await Todo.find({ user: request.user._id });
  response.json(todos);
});

app.post("/add", protect, async (request, response) => {
  const { todo } = request.body;

  if (!todo) {
    response.json({ message: "Please Fill all fields" });
  } else {
    const todoQ = new Todo({ user: request.user._id, todo });
    const createdTodo = await todoQ.save();
    response.status(201).json(createdTodo);
  }
});

app.get("/:id", protect, async (request, response) => {
  const todo = await Todo.findById(request.params.id);
  if (todo) {
    response.json(todo);
  } else {
    response.status(400).json({
      message: "Not Found",
    });
  }
});

app.put("/:id", protect, async (request, response) => {
  const { upDateTodo } = request.body;
  const task = await Todo.findById(request.params.id);
  if (task.user.toString() !== request.user._id.toString()) {
    response.status(401).json({ message: "You cannot Update" });
  }
  if (task) {
    task.todo = upDateTodo;

    const updatedTodo = await task.save();
    response.status(201).json(updatedTodo);
  } else {
    response.send("Todo not found");
  }
});

app.delete("/:id", protect, async (request, response) => {
  const todo = await Todo.findByIdAndDelete(request.params.id);
  if (todo.user.toString() !== request.user._id.toString()) {
    response.status(401).json({ message: "You cannot Update" });
  }
  if (!todo) {
    response.status(404).json({ message: "Not Found" });
  } else {
    response.json({ message: "Todo Removed" });
  }
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, console.log("server started"));
