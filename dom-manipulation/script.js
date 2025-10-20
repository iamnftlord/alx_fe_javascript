// ====== Initial Quotes Data ======
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
  { text: "The secret of getting ahead is getting started.", category: "Motivation" },
];

// ====== Function to Show a Random Quote ======
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Please add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>Category: <strong>${randomQuote.category}</strong></small>
  `;
}

// ====== Function to Add a New Quote ======
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = quoteTextInput.value.trim();
  const newQuoteCategory = quoteCategoryInput.value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Clear input fields
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  alert("New quote added successfully!");
  showRandomQuote(); // Optional: display the newly added quote
}

// ====== Event Listener for 'Show New Quote' Button ======
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
