# Book Directory API

This is a simple Node.js API for managing a book directory. It allows you to perform CRUD (Create, Read, Update, Delete) operations on book entries, with data persistence using a JSON file.

## Features

- List all books
- Get a specific book by ISBN
- Add a new book
- Update an existing book
- Delete a book
- Data persistence using local file storage

## Prerequisites

- Node.js (version 12 or higher recommended)

## Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Create a `data` directory in the project root (if it doesn't exist):
   ```
   mkdir data
   ```
4. Install dependencies (if any are added in the future):
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   node server.js
   ```
2. The server will start running on `http://localhost:3000`.

## API Endpoints

### GET /books
Retrieves all books in the directory.

### GET /books/:isbn
Retrieves a specific book by its ISBN.

### POST /books
Adds a new book to the directory.

Request body should be in JSON format:
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "publisher": "Publisher Name",
  "publishedDate": "YYYY-MM-DD"
}
```

### PUT /books/:isbn
Updates an existing book.

Request body should be in JSON format, similar to POST request.

### DELETE /books/:isbn
Deletes a book from the directory.

## Data Storage

Book data is stored in `data/books.json`. This file is automatically created when the first book is added.

## Error Handling

The API includes basic error handling:
- 400 Bad Request for invalid input
- 404 Not Found for non-existent books
- 405 Method Not Allowed for unsupported HTTP methods

## ISBN Generation

ISBNs are automatically generated for new books. Note that the current implementation uses a simplified random number generation and does not follow the official ISBN-13 standard.

