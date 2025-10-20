// ====== Initial Quotes Data (fallback) ======
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
  { text: "The secret of getting ahead is getting started.", category: "Motivation" },
];

// ====== Storage Keys ======
const LS_KEY = "dynamicQuoteGeneratorQuotes";
const SESSION_LAST_VIEWED = "dqg_lastViewedIndex";

// ====== Web Storage Helpers ======
function saveQuotes() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes to localStorage:", err);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return; // nothing stored
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Basic validation: each item should have text and category
      const valid = parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (valid) quotes = parsed;
      else console.warn("Loaded quotes have invalid structure; keeping defaults.");
    }
  } catch (err) {
    console.error("Failed to load quotes from localStorage:", err);
  }
}

// Optional: store last viewed quote index in sessionStorage
function saveLastViewedIndex(idx) {
  try {
    sessionStorage.setItem(SESSION_LAST_VIEWED, String(idx));
  } catch (err) {
    console.error("Failed to save session data:", err);
  }
}

function loadLastViewedIndex() {
  try {
    const raw = sessionStorage.getItem(SESSION_LAST_VIEWED);
    if (raw !== null) {
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    }
  } catch (err) {
    console.error("Failed to read session data:", err);
  }
  return null;
}

// ====== Function to Create Add Quote Form and Import/Export Controls (for Checker) ======
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");
  if (!formContainer) return;

  // clear container
  formContainer.innerHTML = "";

  // Quote input
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.setAttribute("aria-label", "New quote text");

  // Category input
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Category (e.g., Life, Motivation)";
  categoryInput.setAttribute("aria-label", "New quote category");

  // Add button
  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";
  addButton.type = "button";

  // Export button
  const exportButton = document.createElement("button");
  exportButton.id = "exportQuotesBtn";
  exportButton.textContent = "Export Quotes (JSON)";
  exportButton.type = "button";

  // Import file input (hidden + label)
  const importLabel = document.createElement("label");
  importLabel.textContent = "Import Quotes (JSON)";
  importLabel.htmlFor = "importFile";
  importLabel.style.cursor = "pointer";
  importLabel.style.display = "inline-block";
  importLabel.style.marginLeft = "8px";

  const importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.id = "importFile";
  importFileInput.accept = ".json,application/json";
  importFileInput.style.display = "none";

  // Append elements to container (using createElement + appendChild)
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(document.createTextNode(" ")); // spacing
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(document.createTextNode(" "));
  formContainer.appendChild(addButton);
  formContainer.appendChild(document.createTextNode(" "));
  formContainer.appendChild(exportButton);
  formContainer.appendChild(importLabel);
  formContainer.appendChild(importFileInput);

  // Event listeners
  addButton.addEventListener("click", addQuote);
  exportButton.addEventListener("click", exportToJsonFile);
  importFileInput.addEventListener("change", importFromJsonFile);

  // Also allow pressing Enter in the quote input to add the quote
  [quoteInput, categoryInput].forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addQuote();
      }
    });
  });
}

// ====== Function to Show a Random Quote (uses createElement/appendChild) ======
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quoteDisplay) return;

  // Clear existing content
  while (quoteDisplay.firstChild) quoteDisplay.removeChild(quoteDisplay.firstChild);

  if (quotes.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No quotes available. Please add one!";
    quoteDisplay.appendChild(msg);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteText.style.fontStyle = "italic";

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;

  // Optional: button to show the index (demo usage of additional element)
  const info = document.createElement("div");
  info.style.marginTop = "6px";
  info.appendChild(quoteCategory);

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(info);

  // Save last viewed index in sessionStorage
  saveLastViewedIndex(randomIndex);
}

// ====== Show Last Viewed Quote (if present in session) ======
function showLastViewedIfExists() {
  const idx = loadLastViewedIndex();
  if (idx === null || idx < 0 || idx >= quotes.length) return;
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quoteDisplay) return;

  // Clear existing content
  while (quoteDisplay.firstChild) quoteDisplay.removeChild(quoteDisplay.firstChild);

  const q = quotes[idx];
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${q.text}"`;
  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${q.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ====== Function to Add a New Quote ======
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  if (!quoteTextInput || !quoteCategoryInput) return;

  const newQuoteText = quoteTextInput.value.trim();
  const newQuoteCategory = quoteCategoryInput.value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Persist to localStorage
  saveQuotes();

  // Update the DOM (display newly added quote)
  // We'll show the last added quote explicitly instead of random for clarity
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quoteDisplay) {
    while (quoteDisplay.firstChild) quoteDisplay.removeChild(quoteDisplay.firstChild);

    const p = document.createElement("p");
    p.textContent = `"${newQuote.text}"`;

    const small = document.createElement("small");
    small.textContent = `Category: ${newQuote.category}`;

    quoteDisplay.appendChild(p);
    quoteDisplay.appendChild(small);
  }

  // Clear inputs
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  alert("New quote added and saved!");
}

// ====== Export Quotes to JSON File ======
function exportToJsonFile() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export quotes.");
  }
}

// ====== Import Quotes from JSON File ======
function importFromJsonFile(event) {
  const input = event.target;
  if (!input || !input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (evt) {
    try {
      const parsed = JSON.parse(evt.target.result);

      if (!Array.isArray(parsed)) {
        alert("Imported file is not a valid array of quotes.");
        return;
      }

      // Validate and sanitize items
      const validItems = parsed.filter(item =>
        item && typeof item.text === "string" && typeof item.category === "string"
      );

      if (validItems.length === 0) {
        alert("No valid quotes found in the imported file.");
        return;
      }

      // Merge imported quotes into existing array
      quotes.push(...validItems);

      // Persist
      saveQuotes();

      // Update display (show last imported quote)
      const lastImported = validItems[validItems.length - 1];
      const quoteDisplay = document.getElementById("quoteDisplay");
      if (quoteDisplay) {
        while (quoteDisplay.firstChild) quoteDisplay.removeChild(quoteDisplay.firstChild);
        const p = document.createElement("p");
        p.textContent = `"${lastImported.text}"`;
        const small = document.createElement("small");
        small.textContent = `Category: ${lastImported.category}`;
        quoteDisplay.appendChild(p);
        quoteDisplay.appendChild(small);
      }

      alert(`Imported ${validItems.length} quote(s) successfully!`);
    } catch (err) {
      console.error("Failed to parse imported file:", err);
      alert("There was an error reading the file. Make sure it's valid JSON.");
    } finally {
      // Reset the input so the same file can be imported again if needed
      input.value = "";
    }
  };

  reader.onerror = function () {
    alert("Failed to read the file.");
    input.value = "";
  };

  reader.readAsText(file);
}

// ====== Initialize App ======
function init() {
  loadQuotes();                // load persisted quotes from localStorage
  createAddQuoteForm();        // create form and import/export controls
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Show last viewed quote in this session (if any), else show a random one initially
  const lastIdx = loadLastViewedIndex();
  if (lastIdx !== null && lastIdx >= 0 && lastIdx < quotes.length) {
    showLastViewedIfExists();
  } else {
    showRandomQuote();
  }
}

// Run init when DOM is ready
window.addEventListener("DOMContentLoaded", init);
