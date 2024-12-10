const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/book.model");
const app = express();

app.use(express.json());


// Retrieve and list all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single book
app.get("/api/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: `Book with ID ${id} not found` });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new book
app.post("/api/books", async (req, res) => {
  try {
    const addedBook = await Book.create(req.body);
    res.status(200).json(addedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const updatedBook = await Book.findById(id);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter book by genre
app.get("/api/books/genre/:genre", async (req, res) => {
  try {
    const genreToFind = req.params.genre;
    const genreBooks = await Book.find({ genre: genreToFind });
    res.status(200).json(genreBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toogle book availability
app.patch("/api/books/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: `Book with ID ${id} not found` });
    }

    if (book.isAvailable) {
      book.isAvailable = false;
    } else {
      book.isAvailable = true;
    }

    book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/bookLibrary")
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
