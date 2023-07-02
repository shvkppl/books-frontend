let books

function displayBooks(sortIndex = -1) {
    const search = document.getElementById("search-bar");
    const bookTable = document.getElementById("book-table");
    const newBookBtn = document.getElementById("new-book-button");


    search.style.display = "block";
    bookTable.style.display = "block";
    newBookBtn.style.display = "block";

    const token = localStorage.getItem('token'); 
    if (!token) {
        const search = document.getElementById("search-bar");
        const bookTable = document.getElementById("book-table");
        const newBookBtn = document.getElementById("new-book-button");


        search.style.display = "none";
        bookTable.style.display = "none";
        newBookBtn.style.display = "none";

        const login = document.getElementById("login-form");
        login.style.display = "block";
    }
    fetch('http://localhost:3000/books', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .then(data => {
            books = data
            console.log(books)

            const bookList = document.getElementById("book-list");
            bookList.innerHTML = "";
            if (sortIndex !== -1) {
                books = [...books].sort((a, b) => {
                    if (a[sortIndex] < b[sortIndex]) return -1;
                    if (a[sortIndex] > b[sortIndex]) return 1;
                    return 0;
                });
            }



            books.forEach(book => {
                const row = document.createElement("tr");

                const titleCell = document.createElement("td");
                titleCell.textContent = book.title;

                const authorCell = document.createElement("td");
                authorCell.textContent = book.author;

                const genreCell = document.createElement("td");
                genreCell.textContent = book.genre;

                const publicationDateCell = document.createElement("td");
                if (book.publication_date)
                    publicationDateCell.textContent = book.publication_date.split("T")[0];

                const actionsCell = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.onclick = () => deleteBook(book);

                const updateButton = document.createElement("button");
                updateButton.textContent = "Update";
                updateButton.classList.add("update-button");
                updateButton.onclick = () => showUpdateBookForm(book);

                actionsCell.appendChild(deleteButton);
                actionsCell.appendChild(updateButton);

                row.appendChild(titleCell);
                row.appendChild(authorCell);
                row.appendChild(genreCell);
                row.appendChild(publicationDateCell);
                row.appendChild(actionsCell);

                bookList.appendChild(row);
            });
        })
        .catch(error => {
            // Handle any errors that occur during the fetch
            console.log(error)
            const search = document.getElementById("search-bar");
            const bookTable = document.getElementById("book-table");
            const newBookBtn = document.getElementById("new-book-button");


            search.style.display = "none";
            bookTable.style.display = "none";
            newBookBtn.style.display = "none";

            const login = document.getElementById("login-form");
            login.style.display = "block";
        });

}

// Function to search books based on the input
function searchBooks() {
    const bookTable = document.getElementById("book-table");
    const newBookBtn = document.getElementById("new-book-button");


    bookTable.style.display = "none";
    newBookBtn.style.display = "none";

    const searchResults = document.getElementById("search-results-table");
    searchResults.style.display = "block";
    const homeBtn = document.getElementById("home");
    homeBtn.style.display = "block";


    const searchInput = document.getElementById("search-input").value.toLowerCase();
    console.log(books)
    const filteredBooks = books.filter(book => {
        return (
            book.title.toLowerCase().includes(searchInput) ||
            book.author.toLowerCase().includes(searchInput) ||
            book.genre.toLowerCase().includes(searchInput)
        );
    });
    const bookList = document.getElementById("result-list");
    bookList.innerHTML = "";

    filteredBooks.forEach(book => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;

        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;

        const genreCell = document.createElement("td");
        genreCell.textContent = book.genre;

        const publicationDateCell = document.createElement("td");
        if (book.publication_date)
            publicationDateCell.textContent = book.publication_date.split("T")[0];


        row.appendChild(titleCell);
        row.appendChild(authorCell);
        row.appendChild(genreCell);
        row.appendChild(publicationDateCell);

        bookList.appendChild(row);
    });

}

function sortBooks() {
    const sortBy = document.getElementById("sort-dropdown").value;
    console.log(sortBy)
    displayBooks(sortBy);
}

function deleteBook(book) {
    const URI = "http://localhost:3000/books/" + book.id
    fetch(URI, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    })
        .then(data => {
            displayBooks();
        })
        .catch(error => {
            const login = document.getElementById("login-form");
            login.style.display = "block";
        });
}

function showNewBookForm() {
    const search = document.getElementById("search-bar");
    const bookTable = document.getElementById("book-table");
    const newBookBtn = document.getElementById("new-book-button");


    search.style.display = "none";
    bookTable.style.display = "none";
    newBookBtn.style.display = "none";
    const newBookForm = document.getElementById("new-book-form");
    newBookForm.style.display = "block";
}

// Function to add a new book
function addNewBook(event) {
    event.preventDefault();

    const titleInput = document.getElementById("title-input").value;
    const authorInput = document.getElementById("author-input").value;
    const genreInput = document.getElementById("genre-input").value;
    const publicationDateInput = document.getElementById("publication-date-input").value;

    const newBook = {
        title: titleInput,
        author: authorInput,
        genre: genreInput,
        publication_date: publicationDateInput
    };
    console.log(newBook)

    const token = localStorage.getItem('token'); 
    if (!token) {
        // Redirect the user to the login HTML page
        const newBookForm = document.getElementById("new-book-form");
        newBookForm.style.display = "none";

        const login = document.getElementById("login-form");
        login.style.display = "block";
    }
    fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    })
        .then(response => {
            displayBooks();
        })
        .catch(error => {
            const newBookForm = document.getElementById("new-book-form");
            newBookForm.style.display = "none";

            const login = document.getElementById("login-form");
            login.style.display = "block";
        });


    

    // Reset the form fields
    document.getElementById("title-input").value = "";
    document.getElementById("author-input").value = "";
    document.getElementById("genre-input").value = "";
    document.getElementById("publication-date-input").value = "";

    // Hide the form
    const form = document.getElementById("new-book-form");
    form.style.display = "none";
}

// Function to show the update book form
function showUpdateBookForm(book) {
    const search = document.getElementById("search-bar");
    const bookTable = document.getElementById("book-table");
    const newBookBtn = document.getElementById("new-book-button");


    search.style.display = "none";
    bookTable.style.display = "none";
    newBookBtn.style.display = "none";
    const updateBookForm = document.getElementById("update-book-form");
    const updateTitleInput = document.getElementById("update-title-input");
    const updateAuthorInput = document.getElementById("update-author-input");
    const updateGenreInput = document.getElementById("update-genre-input");
    const updatePublicationDateInput = document.getElementById("update-publication-date-input");

    updateTitleInput.value = book.title;
    updateAuthorInput.value = book.author;
    updateGenreInput.value = book.genre;
    updatePublicationDateInput.value = book.publicationDate;

    const updateBookIdInput = document.getElementById("update-book-id");
    updateBookIdInput.value = book.id;

    updateBookForm.style.display = "block";
}


// Function to update a book
function updateBook(event) {
    event.preventDefault();

    const updateBookIdInput = document.getElementById("update-book-id");
    const updateTitleInput = document.getElementById("update-title-input");
    const updateAuthorInput = document.getElementById("update-author-input");
    const updateGenreInput = document.getElementById("update-genre-input");
    const updatePublicationDateInput = document.getElementById("update-publication-date-input");

    const bookId = updateBookIdInput.value;

    const updatedBook = {
        id: bookId,
        title: updateTitleInput.value,
        author: updateAuthorInput.value,
        genre: updateGenreInput.value,
        publication_date: updatePublicationDateInput.value
    };

    updateBookIdInput

    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex > -1) {
        books[bookIndex] = updatedBook;
        displayBooks(books);
    }

    const updateBookForm = document.getElementById("update-book-form");
    updateBookForm.style.display = "none";
}

function updateBook(event) {
    event.preventDefault();

    const updateBookIdInput = document.getElementById("update-book-id");
    const updateTitleInput = document.getElementById("update-title-input");
    const updateAuthorInput = document.getElementById("update-author-input");
    const updateGenreInput = document.getElementById("update-genre-input");
    const updatePublicationDateInput = document.getElementById("update-publication-date-input");

    const bookId = updateBookIdInput.value;

    const updatedBook = {
        title: updateTitleInput.value,
        author: updateAuthorInput.value,
        genre: updateGenreInput.value,
        publication_date: updatePublicationDateInput.value
    };

    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex > -1) {
        books[bookIndex] = updatedBook;
        displayBooks(books);
    }

    const URI = "http://localhost:3000/books/" + bookId
    fetch(URI, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(updatedBook)
    })
        .then(data => {
            displayBooks();
        })
        .catch(error => {
            const login = document.getElementById("login-form");
            login.style.display = "block";
        });

    const updateBookForm = document.getElementById("update-book-form");
    updateBookForm.style.display = "none";

}

function loginOrRegister(event) {

    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const radioButtons = document.getElementsByName('login-register');
    let isLogin = false


    if (radioButtons[0].checked) {
        isLogin = true
    }

    if (isLogin) {
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('token', data.token);
                console.log(data.token)
                const reg = document.getElementById("regMessage")
                reg.innerHTML = ""
                const login = document.getElementById("login-form");
                login.style.display = "none";
                displayBooks()

            })
            .catch(error => {
                console.log("error")
                const reg = document.getElementById("regMessage")
                reg.innerHTML = "Login failed!!!!"
                const login = document.getElementById("login-form");
                login.style.display = "block";
            });

    } else {
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                const login = document.getElementById("login-form");
                login.style.display = "block";
                const reg = document.getElementById("regMessage")
                reg.innerHTML = "Registration successfull!!!!"
            })
            .catch(error => {
                const login = document.getElementById("login-form");
                login.style.display = "block";
                const reg = document.getElementById("regMessage")
                reg.innerHTML = "Registration failed!!!!"
            });
    }

}

// Function to generate a unique ID for a new book
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function goHome() {
    const searchResults = document.getElementById("search-results-table");
    searchResults.style.display = "none";
    const homeBtn = document.getElementById("home");
    homeBtn.style.display = "none";

    displayBooks()
}

// Initial display of books
displayBooks();