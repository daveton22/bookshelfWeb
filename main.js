// Do your work here...

const addBookButton = document.getElementById("bookFormSubmit");
const deleteBookButton = document.getElementById("bookItemDeleteButton");
const editBookButton = document.getElementById("bookItemEditButton");
const doneBookButton = document.getElementById("bookItemIsCompleteButton");
const searchBookbutton = document.getElementById("searchSubmit");
let bookObjectData = {};

// edit, delete, dan tandai buku selesai atau belum selesai
document.addEventListener("click", (event) => {
  // 1. edit judul, penulis, dan tahun buku
  if (event.target && event.target.dataset.testid === "bookItemEditButton") {
    const bookItem = event.target.closest("[data-testid=bookItem]");
    const bookId = bookItem.dataset.bookid;
    const bookData = JSON.parse(localStorage.getItem(bookId));

    const newTitle = prompt(
      "Edit Title",
      bookItem.querySelector("[data-testid=bookItemTitle]").textContent
    );
    if (newTitle) {
      bookItem.querySelector("[data-testid=bookItemTitle]").textContent =
        newTitle;
      bookData.title = newTitle;
    }
    const newAuthor = prompt(
      "Edit Author",
      bookItem
        .querySelector("[data-testid=bookItemAuthor]")
        .textContent.replace("Penulis: ", "")
    );
    if (newAuthor) {
      bookItem.querySelector(
        "[data-testid=bookItemAuthor]"
      ).textContent = `Penulis: ${newAuthor}`;
      bookData.author = newAuthor;
    }
    const newYear = prompt(
      "Edit Year",
      bookItem
        .querySelector("[data-testid=bookItemYear]")
        .textContent.replace("Tahun: ", "")
    );
    if (newYear) {
      bookItem.querySelector(
        "[data-testid=bookItemYear]"
      ).textContent = `Tahun: ${newYear}`;
      bookData.year = newYear;
    }

    localStorage.setItem(bookId, JSON.stringify(bookData));
  }

  // 2. Hapus buku
  if (event.target && event.target.dataset.testid === "bookItemDeleteButton") {
    const bookItem = event.target.closest("[data-testid=bookItem]");
    const bookId = bookItem.dataset.bookid;
    bookItem.remove();

    localStorage.removeItem(bookId);
  }

  // 3. tandai buku selesai atau belum selesai
  if (
    event.target &&
    event.target.dataset.testid === "bookItemIsCompleteButton"
  ) {
    const bookItem = event.target.closest("[data-testid=bookItem]");
    const bookId = bookItem.dataset.bookid;
    const bookData = JSON.parse(localStorage.getItem(bookId));

    bookData.isComplete = !bookData.isComplete;
    localStorage.setItem(bookId, JSON.stringify(bookData));

    const completeRead = document.getElementById("completeBookList");
    const incompleteComplete = document.getElementById("incompleteBookList");

    if (bookData.isComplete) {
      completeRead.appendChild(bookItem);
      event.target.textContent = "Belum selesai baca";
    } else {
      incompleteComplete.appendChild(bookItem);
      event.target.textContent = "Selesai baca";
    }
  }
});

// menambahkan buku
addBookButton.addEventListener("click", (event) => {
  event.preventDefault();
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;
  const bookId = Number(new Date());

  if (!bookTitle || !bookAuthor || !bookYear) {
    alert("Mohon isi buku dengan lengkap");
    return;
  }

  bookObjectData = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: Number(bookYear),
    isComplete: bookIsComplete,
  };

  const completeComplete = document.getElementById("completeBookList");
  const incompleteComplete = document.getElementById("incompleteBookList");

  if (bookIsComplete) {
    completeComplete.innerHTML += bukuItem(bookObjectData);
  } else {
    incompleteComplete.innerHTML += bukuItem(bookObjectData);
  }

  console.log(bookObjectData);

  localStorage.setItem(bookId, JSON.stringify(bookObjectData));
});

// mencari buku berdasarkan judul
searchBookbutton.addEventListener("click", (event) => {
  event.preventDefault();
  const searchBookbyTitle = document.getElementById("searchBookTitle");
  const searchedBook = document.getElementById("searchedBook");
  const searchBook = searchBookbyTitle.value.toLowerCase();

  searchedBook.innerHTML = "";

  if (searchBook) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const bookData = JSON.parse(localStorage.getItem(key));

      if (bookData.title.toLowerCase().includes(searchBook)) {
        searchedBook.innerHTML += bukuItem(bookData);
      }
    }
  } else {
    alert("Masukkan judul buku yang ingin dicari");
  }
});

// saat reload, tampilkan data buku yang ada di local storage
window.addEventListener("load", () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const bookData = JSON.parse(localStorage.getItem(key));
    const completeBookList = document.getElementById("completeBookList");
    const incompleteBookList = document.getElementById("incompleteBookList");

    if (bookData.isComplete) {
      completeBookList.innerHTML += bukuItem(bookData);
    } else {
      incompleteBookList.innerHTML += bukuItem(bookData);
    }
  }
});

const bookIsComplete = document.getElementById("bookFormIsComplete");
bookIsComplete.addEventListener("click", (event) => {
  const bookFormSubmit = document.getElementById("bookFormSubmit");
  const span = bookFormSubmit.querySelector("span");

  if (bookIsComplete.checked) {
    bookFormSubmit.removeChild(span);
  } else {
    const span = document.createElement("span");
    span.textContent = "Belum selesai dibaca";
    bookFormSubmit.appendChild(span);
  }
});

// bukuItem function untuk menampilkan data buku html
function bukuItem(bookObjectData) {
  return `
  <div data-bookid="${bookObjectData.id}" data-testid="bookItem">
  <h3 data-testid="bookItemTitle">${bookObjectData.title}</h3>
  <p data-testid="bookItemAuthor">Penulis: ${bookObjectData.author}</p>
  <p data-testid="bookItemYear">Tahun: ${bookObjectData.year}</p>
  <div>
    <button data-testid="bookItemIsCompleteButton">Selesai baca</button>
    <button data-testid="bookItemDeleteButton">Hapus buku</button>
    <button data-testid="bookItemEditButton">Edit buku</button>
  </div>
</div>
  `;
}
