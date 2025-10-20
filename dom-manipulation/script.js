// ====== Initial Quotes Data ======
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
  { text: "The secret of getting ahead is getting started.", category: "Motivation" },
];

// ====== Storage Keys ======
const LS_QUOTES = "dynamicQuoteGeneratorQuotes";
const LS_FILTER = "lastSelectedCategory";

// ====== Save & Load Quotes ======
function saveQuotes() {
  localStorage.setItem(LS_QUOTES, JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem(LS_QUOTES);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) quotes = parsed;
    } catch (e) {
      console.error("Error parsing stored quotes:", e);
    }
  }
}

// ====== Populate Categories ======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // Get unique categories from quotes
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options except "All"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Add each category as an option
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter if available
  const savedFilter = localStorage.getItem(LS_FILTER);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

// ====== Filter Quotes ======
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem(LS_FILTER, selectedCategory); // remember filter

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  // Filter logic
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  // Display filtered quotes
  filteredQuotes.forEach(q => {
    const quoteBlock = document.createElement("div");
    quoteBlock.className = "quote-block";

    const textEl = document.createElement("p");
    textEl.textContent = `"${q.text}"`;

    const catEl = document.createElement("small");
    catEl.textContent = `Category: ${q.category}`;

    quoteBlock.appendChild(textEl);
    quoteBlock.appendChild(catEl);
    quoteDisplay.appendChild(quoteBlock);
  });
}

// ====== Show Random Quote ======
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const p = document.createElement("p");
  p.textContent = `"${randomQuote.text}"`;

  const s = document.createElement("small");
  s.textContent = `Category: ${randomQuote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(s);

  // Update session storage for last viewed quote
  sessionStorage.setItem("lastViewedQuote", randomIndex);
}

// ====== Add New Quote ======
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  saveQuotes();
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added successfully!");
}

// ====== Export to JSON ======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ====== Import from JSON ======
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Failed to read file. Make sure it's valid JSON.");
    }
  };
  reader.readAsText(file);
}

// ====== Initialize ======
function init() {
  loadQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
}

window.addEventListener("DOMContentLoaded", init);
