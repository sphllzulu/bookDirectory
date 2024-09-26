// const http = require('http');

// // In-memory storage for books
// let books = [];

// // Helper function to generate a random ISBN
// const generateISBN = () => Math.floor(Math.random() * 9000000000000) + 1000000000000;

// // Helper function to find a book by ISBN
// const findBookByISBN = (isbn) => books.find(book => book.isbn === isbn);

// // Helper function to validate book data
// const validateBook = (book) => {
//     if (!book.title || !book.author || !book.publisher || !book.publishedDate) {
//         return false;
//     }
//     return true;
// };

// const server = http.createServer((req, res) => {
//     const { method, url } = req;

//     // Set CORS headers
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     // Handle preflight requests
//     if (method === 'OPTIONS') {
//         res.writeHead(204);
//         res.end();
//         return;
//     }

//     // GET request to retrieve all books or a specific book
//     if (method === 'GET') {
//         if (url === '/books') {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(books));
//         } else if (url.startsWith('/books/')) {
//             const isbn = parseInt(url.split('/')[2]);
//             const book = findBookByISBN(isbn);
//             if (book) {
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify(book));
//             } else {
//                 res.writeHead(404, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ error: 'Book not found' }));
//             }
//         } else {
//             res.writeHead(404, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ error: 'Not found' }));
//         }
//     }

//     // POST request to add a new book
//     else if (method === 'POST' && url === '/books') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             const book = JSON.parse(body);
//             if (validateBook(book)) {
//                 book.isbn = generateISBN();
//                 books.push(book);
//                 res.writeHead(201, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify(book));
//             } else {
//                 res.writeHead(400, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ error: 'Invalid book data' }));
//             }
//         });
//     }

//     // PUT request to update a book
//     else if (method === 'PUT' && url.startsWith('/books/')) {
//         const isbn = parseInt(url.split('/')[2]);
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             const updatedBook = JSON.parse(body);
//             const bookIndex = books.findIndex(book => book.isbn === isbn);
//             if (bookIndex !== -1 && validateBook(updatedBook)) {
//                 books[bookIndex] = { ...updatedBook, isbn };
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify(books[bookIndex]));
//             } else {
//                 res.writeHead(404, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ error: 'Book not found or invalid data' }));
//             }
//         });
//     }

//     // DELETE request to remove a book
//     else if (method === 'DELETE' && url.startsWith('/books/')) {
//         const isbn = parseInt(url.split('/')[2]);
//         const bookIndex = books.findIndex(book => book.isbn === isbn);
//         if (bookIndex !== -1) {
//             books.splice(bookIndex, 1);
//             res.writeHead(204);
//             res.end();
//         } else {
//             res.writeHead(404, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ error: 'Book not found' }));
//         }
//     }

//     // Handle unsupported requests
//     else {
//         res.writeHead(405, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ error: 'Method not allowed' }));
//     }
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data'); //creating a folder called data
const BOOKS_FILE = path.join(DATA_DIR, 'books.json'); //creating a json file to store all the posts

// checks if the folder exists, if it doesnt, a directory it is created
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

//reads the books.json file and returns the data, if nothing is on the file, it returns an empty array
const readBooksFromFile = () => {
    if (fs.existsSync(BOOKS_FILE)) {
        const data = fs.readFileSync(BOOKS_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

//write the data to the json file
const writeBooksToFile = (books) => {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null,2));
};

// Initialize books from file
let books = readBooksFromFile();

//math.random generates any number from 0-1, multiplying it by 9000000000000 and adding 1000000000000 for 13 digits, then round down to the nearest integer
const generateISBN = () => Math.floor(Math.random() * 9000000000000) + 1000000000000;

//function to find the book by isbn
const findBookByISBN = (isbn) => books.find(book => book.isbn === isbn);


const validateBook = (book) => {
    if (!book.title || !book.author || !book.publisher || !book.publishedDate) {
        return false;
    }
    return true;
};

const server = http.createServer((req, res) => {
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

    // GET request to retrieve all books or a specific book
    if (method === 'GET') {
        if (url === '/books') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(books));
        } else if (url.startsWith('/books/')) {
            const isbn = parseInt(url.split('/')[2]);
            const book = findBookByISBN(isbn);
            if (book) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(book));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Book not found' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    }

    // POST request to add a new book
    else if (method === 'POST' && url === '/books') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const book = JSON.parse(body);
            if (validateBook(book)) {
                book.isbn = generateISBN();
                books.push(book);
                writeBooksToFile(books);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(book));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid book data' }));
            }
        });
    }

    // PUT request to update a book
    else if (method === 'PUT' && url.startsWith('/books/')) {
        const isbn = parseInt(url.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedBook = JSON.parse(body);
            const bookIndex = books.findIndex(book => book.isbn === isbn);
            if (bookIndex !== -1 && validateBook(updatedBook)) {
                books[bookIndex] = { ...updatedBook, isbn };
                writeBooksToFile(books);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(books[bookIndex]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Book not found or invalid data' }));
            }
        });
    }

    // DELETE request to remove a book
    else if (method === 'DELETE' && url.startsWith('/books/')) {
        const isbn = parseInt(url.split('/')[2]);
        const bookIndex = books.findIndex(book => book.isbn === isbn);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            writeBooksToFile(books);
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Book not found' }));
        }
    }

    // Handle unsupported requests
    else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});