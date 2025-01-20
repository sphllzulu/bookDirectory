

// Importing required modules

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');

// Helper function to read books from file
const readBooks = async () => {
  try {
    await fs.access(BOOKS_FILE);
    const data = await fs.readFile(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write books to file
const writeBooks = async (books) => {
  await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
};

// Main server function
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let books = await readBooks();

  // Helper function to send JSON response
  const sendJSON = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Helper function to parse request body
  const parseBody = async () => {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    return JSON.parse(Buffer.concat(buffers).toString());
  };

  // GET request to retrieve all books or a specific book
  if (method === 'GET') {
    if (url === '/books') {
      sendJSON(200, books);
    } else if (url.startsWith('/books/')) {
      const isbn = url.split('/')[2];
      const book = books.find(b => b.isbn === isbn);
      book ? sendJSON(200, book) : sendJSON(404, { error: 'Book not found' });
    } else {
      sendJSON(404, { error: 'Not found' });
    }
  }

  // POST request to add a new book
  else if (method === 'POST' && url === '/books') {
    const book = await parseBody();
    // My custom validation - checking all required fields and ISBN uniqueness
    if (!book.title || !book.author || !book.publisher || !book.publishedDate || !book.isbn) {
      sendJSON(400, { error: 'Missing required fields' });
    } else if (books.some(b => b.isbn === book.isbn)) {
      sendJSON(400, { error: 'ISBN must be unique' });
    } else {
      books.push(book);
      await writeBooks(books);
      sendJSON(201, book);
    }
  }

  // PUT request to update a book
  else if (method === 'PUT' && url.startsWith('/books/')) {
    const isbn = url.split('/')[2];
    const updatedBook = await parseBody();
    const index = books.findIndex(b => b.isbn === isbn);
    if (index !== -1) {
      // My custom logic - prevent changing ISBN
      updatedBook.isbn = isbn;
      books[index] = updatedBook;
      await writeBooks(books);
      sendJSON(200, updatedBook);
    } else {
      sendJSON(404, { error: 'Book not found' });
    }
  }

  // DELETE request to remove a book
  else if (method === 'DELETE' && url.startsWith('/books/')) {
    const isbn = url.split('/')[2];
    const index = books.findIndex(b => b.isbn === isbn);
    if (index !== -1) {
      books.splice(index, 1);
      await writeBooks(books);
      res.writeHead(204);
      res.end();
    } else {
      sendJSON(404, { error: 'Book not found' });
    }
  }

  // Handle unsupported requests
  else {
    sendJSON(405, { error: 'Method not allowed' });
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TODO: Add error logging
// TODO: Implement search functionality
// TODO: Add pagination for GET /books