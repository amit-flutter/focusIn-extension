// Curated motivational quotes
const QUOTES = [
  "Opportunities don't happen, you create them. Go apply!",
  "Focus on being productive instead of busy.",
  "Build your own dreams, or someone else will hire you to build theirs.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't scroll your life away. Your next career move is waiting.",
  "Make today count. Send that application, build that connection.",
  "Be stubborn about your goals and flexible about your methods.",
  "The secret of getting ahead is getting started."
];

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle-shield");
  const statusText = document.getElementById("status-text");
  const evadedValue = document.getElementById("stat-evaded");
  const scoreValue = document.getElementById("stat-score");
  const quoteEl = document.getElementById("popup-quote");
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  // Load random quote
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteEl.textContent = `"${randomQuote}"`;

  // Restore states from storage
  chrome.storage.local.get({ 
    shieldEnabled: true, 
    distractionCount: 0,
    theme: "dark"
  }, (items) => {
    // Shield state
    toggle.checked = items.shieldEnabled;
    updateStatusText(items.shieldEnabled);
    
    // Stats
    const count = items.distractionCount;
    evadedValue.textContent = count;
    scoreValue.textContent = count * 10;

    // Theme state
    applyTheme(items.theme);
  });

  // Handle Shield toggle change
  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked;
    updateStatusText(isEnabled);

    chrome.storage.local.set({ shieldEnabled: isEnabled }, () => {
      broadcastMessage({ action: "toggleShield", enabled: isEnabled });
    });
  });

  // Handle Theme toggle click
  themeToggle.addEventListener("click", () => {
    const isCurrentLight = document.body.classList.contains("theme-light");
    const newTheme = isCurrentLight ? "dark" : "light";
    
    chrome.storage.local.set({ theme: newTheme }, () => {
      applyTheme(newTheme);
      broadcastMessage({ action: "toggleTheme", theme: newTheme });
    });
  });

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("theme-light");
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      document.body.classList.remove("theme-light");
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  }

  function updateStatusText(enabled) {
    if (enabled) {
      statusText.textContent = "Shielding active";
      statusText.style.color = "var(--primary-hover)";
    } else {
      statusText.textContent = "Shielding paused";
      statusText.style.color = "var(--text-muted)";
    }
  }

  // Helper to send messages to active LinkedIn tab
  function broadcastMessage(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, data).catch(() => {
          // Ignore error when content script is not loaded
        });
      }
    });
  }
});
