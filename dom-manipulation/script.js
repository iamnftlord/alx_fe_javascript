// ====== Initial Quotes ======
let quotes = [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { id: 3, text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" },
];

const LS_QUOTES = "dynamicQuoteGeneratorQuotes";
const LS_FILTER = "lastSelectedCategory";
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // mock server

// ====== Load & Save ======
function saveQuotes() {
  localStorage.setItem(LS_QUOTES, JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem(LS_QUOTES);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) quotes = parsed;
    } catch (err) {
      console.error("Error loading quotes:", err);
    }
  }
}

// ====== UI ======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const saved = localStorage.getItem(LS_FILTER);
  if (saved) {
    categoryFilter.value = saved;
    filterQuotes();
  }
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem(LS_FILTER, selected);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote-block";
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;
    const s = document.createElement("small");
    s.textContent = `Category: ${q.category}`;
    div.appendChild(p);
    div.appendChild(s);
    quoteDisplay.appendChild(div);
  });
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const p = document.createElement("p");
  p.textContent = `"${randomQuote.text}"`;
  const s = document.createElement("small");
  s.textContent = `Category: ${randomQuote.category}`;
  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(s);
}

// ====== Add Quote ======
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return alert("Please fill in both fields.");

  const newQuote = { id: Date.now(), text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  alert("Quote added locally!");
}

// ====== Export/Import ======
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

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported!");
      }
    } catch {
      alert("Invalid JSON file!");
    }
  };
  reader.readAsText(file);
}

// ====== 🔁 Server Sync Simulation ======
async function syncWithServer() {
  const status = document.getElementById("syncStatus");
  status.textContent = "Syncing with server...";

  try {
    // Simulate GET request to fetch latest data
    const response = await fetch(API_URL);
    const serverData = await response.json();

    // Fake server quotes (we’ll map first few posts)
    const serverQuotes = serverData.slice(0, 3).map(post => ({
      id: post.id,
      text: post.title,
      category: "Server",
    }));

    let updated = false;

    // Conflict resolution: server overwrites same ID
    serverQuotes.forEach(serverQuote => {
      const index = quotes.findIndex(q => q.id === serverQuote.id);
      if (index !== -1) {
        quotes[index] = serverQuote;
        updated = true;
      } else {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      status.textContent = "✅ Synced with server — local data updated!";
    } else {
      status.textContent = "✅ Already up to date!";
    }
  } catch (error) {
    console.error(error);
    status.textContent = "⚠️ Sync failed. Check your connection.";
  }
}

// ====== Periodic Sync (every 60s) ======
setInterval(syncWithServer, 60000);

// ====== Init ======
function init() {
  loadQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("syncBtn").addEventListener("click", syncWithServer);
}

window.addEventListener("DOMContentLoaded", init);
