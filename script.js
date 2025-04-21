const adminPassword = "dreamadmin123";
let books = [];

document.getElementById("adminBtn").addEventListener("click", () => {
  const password = prompt("Enter admin password:");
  if (password === adminPassword) {
    document.getElementById("adminPanel").classList.remove("hidden");
  } else {
    alert("Incorrect password.");
  }
});

function uploadBooks() {
  const fileInput = document.getElementById("bookFile");
  const reader = new FileReader();
  reader.onload = async function () {
    try {
      const newBooks = JSON.parse(reader.result);
      books = books.concat(await enrichBooks(newBooks));
      displayScrollBooks();
      alert("Books uploaded successfully.");
    } catch (e) {
      alert("Invalid JSON file.");
    }
  };
  if (fileInput.files.length > 0) {
    reader.readAsText(fileInput.files[0]);
  }
}

async function enrichBooks(bookList) {
  return await Promise.all(bookList.map(async (book) => {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}`);
    const data = await res.json();
    const info = data.items?.[0]?.volumeInfo || {};
    return {
      title: book.title,
      genre: book.genre,
      description: info.description || "No description available.",
      image: info.imageLinks?.thumbnail || ""
    };
  }));
}

function searchBooks() {
  const prompt = document.getElementById("promptInput").value.toLowerCase();
  const matches = books.filter(book =>
    book.title.toLowerCase().includes(prompt) ||
    book.description.toLowerCase().includes(prompt)
  ).slice(0, 3);
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";
  matches.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = \`
      <img src="\${book.image}" width="100%" /><h3>\${book.title}</h3><p>\${book.description}</p>
    \`;
    resultDiv.appendChild(card);
  });
}

function displayScrollBooks() {
  const scrollContainer = document.getElementById("scrollBooks");
  scrollContainer.innerHTML = "";
  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = \`
      <img src="\${book.image}" width="100%" /><h4>\${book.title}</h4>
    \`;
    scrollContainer.appendChild(card);
  });
}