const express = require("express");
const app = express();
const PORT = 3000;

// Built-in middleware to read JSON request bodies
app.use(express.json());

// Custom middleware: log every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Basic routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express server");
});

app.get("/about", (req, res) => {
  res.send("This is the About page");
});

// Route parameter:  /hello/Rishabh
app.get("/hello/:name", (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

// Query string:  /search?q=express
app.get("/search", (req, res) => {
  res.json({ query: req.query.q || null });
});

// POST route
app.post("/contact", (req, res) => {
  const { name, message } = req.body || {};
  res.status(201).json({ status: "Message received", name, message });
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
