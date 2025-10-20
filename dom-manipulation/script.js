// ====== Initial Quotes Data ======
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
  { text: "The secret of getting ahead is getting started.", category: "Motivation" },
];

// ====== Function to Create Add Quote Form ======
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  // Create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter category";

  // Create button to add quote
  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";

  // Append elements to the form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Add event listener to the button
  addButton.addEventListener("click", addQuote);
}

// ====== Function to Show a Random Quote ======
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear existing content
  quoteDisplay.innerHTML = "";

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Please add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Create new DOM elements using createElement
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;

  // Append elements to display area
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
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

  // Add new quote to array
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Update the DOM (show latest quote)
  showRandomQuote();

  // Clear inputs
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  alert("New quote added successfully!");
}

// ====== Event Listener for 'Show New Quote' Button ======
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ====== Initialize Form on Page Load ======
window.addEventListener("DOMContentLoaded", createAddQuoteForm);
