// Curated quotes for the main dashboard overlay
const INJECTED_QUOTES = [
  { text: "Your career is your business. It's time to manage it like a CEO.", author: "Andy Grove" },
  { text: "Opportunities don't happen, you create them. Stop scrolling and start applying.", author: "Chris Grosser" },
  { text: "Focus on being productive instead of busy. The feed won't get you hired.", author: "Tim Ferriss" },
  { text: "Action is the foundational key to all success. Take action today.", author: "Pablo Picasso" },
  { text: "Build your own dreams, or someone else will hire you to build theirs.", author: "Farrah Gray" },
  { text: "The secret of getting ahead is getting started. Find your next opportunity.", author: "Mark Twain" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { text: "Be stubborn about your goals and flexible about your methods.", author: "Unknown" }
];

let shieldEnabled = true;
let hasBlockedThisRoute = false;
let currentPath = "";
let currentTheme = "dark";

// Pomodoro Timer State Variables
let pomoTimeLeft = 25 * 60;
let pomoInterval = null;
let pomoIsRunning = false;
let pomoMode = "focus"; // "focus", "short", "long"

const POMO_DURATIONS = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

// Initialize Extension
function init() {
  if (!document.body) {
    setTimeout(init, 50);
    return;
  }

  // Load state and run blocker loop
  chrome.storage.local.get({ shieldEnabled: true, theme: "dark" }, (items) => {
    shieldEnabled = items.shieldEnabled;
    currentTheme = items.theme;
    checkRoute();
  });

  // Periodically check URL for SPA navigation
  setInterval(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      hasBlockedThisRoute = false; // Reset block tracker for new URL path
      checkRoute();
    }
  }, 500);

  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleShield") {
      shieldEnabled = message.enabled;
      checkRoute();
      sendResponse({ status: "ok" });
    } else if (message.action === "toggleTheme") {
      currentTheme = message.theme;
      applyThemeToUI(currentTheme);
      sendResponse({ status: "ok" });
    }
  });
}

// Check route and apply shield if necessary
function checkRoute() {
  const isFeed = window.location.pathname === "/feed" || window.location.pathname === "/feed/";
  
  if (isFeed && shieldEnabled) {
    applyShield();
  } else {
    removeShield();
  }
}

// Apply Blocker UI
function applyShield() {
  document.body.classList.add("focusin-blocked");
  
  // Create dashboard overlay if it doesn't exist
  let dashboard = document.getElementById("focusin-dashboard");
  if (!dashboard) {
    dashboard = createDashboard();
    document.body.appendChild(dashboard);
    loadDashboardData();
    initPomodoroControls();
  } else {
    dashboard.style.display = "flex";
  }

  applyThemeToUI(currentTheme);

  // If this is the initial block on this visit to /feed, increment score
  if (!hasBlockedThisRoute) {
    hasBlockedThisRoute = true;
    incrementDistractionScore();
  }
}

// Remove Blocker UI
function removeShield() {
  document.body.classList.remove("focusin-blocked");
  const dashboard = document.getElementById("focusin-dashboard");
  if (dashboard) {
    dashboard.style.display = "none";
    pausePomodoro(); // Pause the timer if we navigate away or turn shield off
  }
}

function applyThemeToUI(theme) {
  const dashboard = document.getElementById("focusin-dashboard");
  if (!dashboard) return;

  if (theme === "light") {
    dashboard.classList.remove("focusin-theme-dark");
    dashboard.classList.add("focusin-theme-light");
  } else {
    dashboard.classList.remove("focusin-theme-light");
    dashboard.classList.add("focusin-theme-dark");
  }
}

// Increment distraction counter in Chrome Storage
function incrementDistractionScore() {
  chrome.storage.local.get({ distractionCount: 0 }, (items) => {
    const newCount = items.distractionCount + 1;
    chrome.storage.local.set({ distractionCount: newCount }, () => {
      // Update the inline scoreboard on the dashboard if present
      const scoreCountEl = document.getElementById("focusin-score-val");
      const evCountEl = document.getElementById("focusin-ev-val");
      if (scoreCountEl && evCountEl) {
        evCountEl.textContent = newCount;
        scoreCountEl.textContent = newCount * 10;
      }
    });
  });
}

// Create and Inject the Focus Dashboard
function createDashboard() {
  const container = document.createElement("div");
  container.id = "focusin-dashboard";

  // Select a random quote
  const quote = INJECTED_QUOTES[Math.floor(Math.random() * INJECTED_QUOTES.length)];

  container.innerHTML = `
    <div class="focusin-layout">
      
      <!-- Left Sidebar: Dev Tools -->
      <div class="focusin-sidebar-left animate-fade-in">
        <div class="focusin-sidebar-card">
          <h3>🚀 Amit's Dev Tools</h3>
          <div class="focusin-tool-list">
            <div class="focusin-tool-item">
              <div class="focusin-tool-name">FocusIn Blocker</div>
              <div class="focusin-tool-desc">Current tool. Replaces the feed with a dynamic focus canvas.</div>
              <a href="https://amit-flutter.github.io/" target="_blank" class="focusin-tool-link">Active 🟢</a>
            </div>
            <div class="focusin-tool-item">
              <div class="focusin-tool-name">Flutter Boilerplate Kit</div>
              <div class="focusin-tool-desc">Quickly generate code bases with Clean Architecture pre-configured.</div>
              <a href="https://amit-flutter.github.io/" target="_blank" class="focusin-tool-link">Explore ↗</a>
            </div>
            <div class="focusin-tool-item">
              <div class="focusin-tool-name">Git Commit Automator</div>
              <div class="focusin-tool-desc">A command-line script to structure clean git commits dynamically.</div>
              <a href="https://amit-flutter.github.io/" target="_blank" class="focusin-tool-link">View Tool ↗</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Column: Core Blocker Card -->
      <div class="focusin-glass-card animate-fade-in">
        <div class="focusin-logo-header">
          <svg class="focusin-header-icon" viewBox="0 0 512 512" width="44" height="44">
            <defs>
              <linearGradient id="cnt-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a" />
                <stop offset="100%" stop-color="#1e293b" />
              </linearGradient>
              <linearGradient id="cnt-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1d4ed8" />
                <stop offset="100%" stop-color="#0369a1" />
              </linearGradient>
              <linearGradient id="cnt-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#06f2d4" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" rx="112" fill="url(#cnt-bg-grad)" />
            <path d="M256,64 C320,64 380,84 416,112 C416,256 360,380 256,448 C152,380 96,256 96,112 C132,84 192,64 256,64 Z" fill="url(#cnt-shield-grad)" stroke="#3b82f6" stroke-width="8" opacity="0.85" />
            <circle cx="256" cy="256" r="110" fill="none" stroke="url(#cnt-neon-grad)" stroke-width="12" />
            <circle cx="256" cy="256" r="70" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="8 8" opacity="0.7" />
            <circle cx="256" cy="256" r="30" fill="url(#cnt-neon-grad)" />
            <g>
              <line x1="256" y1="256" x2="370" y2="142" stroke="url(#cnt-neon-grad)" stroke-width="16" stroke-linecap="round" />
              <path d="M310,142 L370,142 L370,202" fill="none" stroke="url(#cnt-neon-grad)" stroke-width="16" stroke-linecap="round" />
            </g>
          </svg>
          <div class="focusin-header-text">
            <h2>FocusIn</h2>
            <p>Career Accelerator Dashboard</p>
          </div>
        </div>

        <!-- Redesigned Quote Card -->
        <div class="focusin-quote-card">
          <p class="focusin-quote-text">"${quote.text}"</p>
          <p class="focusin-quote-author">— ${quote.author}</p>
        </div>

        <!-- Scoreboard Display -->
        <div class="focusin-scoreboard">
          <div class="focusin-score-item">
            <span class="focusin-score-val" id="focusin-ev-val">0</span>
            <span class="focusin-score-lbl">Distractions Avoided</span>
          </div>
          <div class="focusin-score-item">
            <span class="focusin-score-val" id="focusin-score-val">0</span>
            <span class="focusin-score-lbl">Focus Score</span>
          </div>
        </div>

        <!-- Interactive Daily Checklist -->
        <div class="focusin-tasks">
          <h3>🎯 Today's Career Checklist</h3>
          <div class="focusin-task-item">
            <label class="focusin-checkbox-container">
              <input type="checkbox" id="focusin-task-1">
              <span class="focusin-checkbox-checkmark"></span>
              Apply to 3 targeted job postings
            </label>
          </div>
          <div class="focusin-task-item">
            <label class="focusin-checkbox-container">
              <input type="checkbox" id="focusin-task-2">
              <span class="focusin-checkbox-checkmark"></span>
              Connect with 2 professionals / recruiters
            </label>
          </div>
          <div class="focusin-task-item">
            <label class="focusin-checkbox-container">
              <input type="checkbox" id="focusin-task-3">
              <span class="focusin-checkbox-checkmark"></span>
              Polish my resume or write a cover letter
            </label>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="focusin-actions">
          <a href="/jobs/" class="focusin-btn focusin-btn-primary">
            💼 Search for Jobs
          </a>
          <a href="/messaging/" class="focusin-btn focusin-btn-secondary">
            ✉️ Reply to Messaging
          </a>
          <a href="/mynetwork/" class="focusin-btn focusin-btn-secondary">
            👥 Grow Network
          </a>
        </div>

        <!-- Footer Portfolio Credits -->
        <div class="focusin-footer">
          Made with ❤️ by <a href="https://amit-flutter.github.io/" target="_blank">Amit</a> in India
        </div>
      </div>

      <!-- Right Sidebar: Pomodoro Focus Timer -->
      <div class="focusin-sidebar-right animate-fade-in">
        <div class="focusin-sidebar-card">
          <h3>⏱️ Pomodoro Shield</h3>
          <div class="focusin-pomodoro-container">
            <div class="focusin-pomo-modes">
              <button class="focusin-pomo-mode-btn active" data-mode="focus">Focus</button>
              <button class="focusin-pomo-mode-btn" data-mode="short">Break</button>
              <button class="focusin-pomo-mode-btn" data-mode="long">Long</button>
            </div>
            
            <div class="focusin-pomo-time" id="focusin-pomo-display">25:00</div>
            
            <div class="focusin-pomo-controls">
              <button class="focusin-pomo-btn" id="focusin-pomo-start">▶ Start</button>
              <button class="focusin-pomo-btn focusin-pomo-btn-reset" id="focusin-pomo-reset" title="Reset Timer">🔄</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Wire up checklist persistence
  container.querySelectorAll('.focusin-tasks input[type="checkbox"]').forEach((chk, idx) => {
    chk.addEventListener("change", () => {
      saveChecklistState();
    });
  });

  return container;
}

// Load stats and checklist data from storage
function loadDashboardData() {
  chrome.storage.local.get({
    distractionCount: 0,
    checklistState: [false, false, false]
  }, (items) => {
    // Update Score
    const scoreVal = document.getElementById("focusin-score-val");
    const evVal = document.getElementById("focusin-ev-val");
    if (scoreVal && evVal) {
      evVal.textContent = items.distractionCount;
      scoreVal.textContent = items.distractionCount * 10;
    }

    // Restore Checklist State
    items.checklistState.forEach((state, idx) => {
      const chk = document.getElementById(`focusin-task-${idx + 1}`);
      if (chk) chk.checked = state;
    });
  });
}

// Save Checklist state to storage
function saveChecklistState() {
  const states = [
    document.getElementById("focusin-task-1").checked,
    document.getElementById("focusin-task-2").checked,
    document.getElementById("focusin-task-3").checked
  ];
  chrome.storage.local.set({ checklistState: states });
}

// ==========================================
// POMODORO TIMER CORE FUNCTIONALITY
// ==========================================

function initPomodoroControls() {
  const display = document.getElementById("focusin-pomo-display");
  const startBtn = document.getElementById("focusin-pomo-start");
  const resetBtn = document.getElementById("focusin-pomo-reset");
  const modeBtns = document.querySelectorAll(".focusin-pomo-mode-btn");

  if (!display || !startBtn || !resetBtn) return;

  // Handle Play/Pause
  startBtn.addEventListener("click", () => {
    if (pomoIsRunning) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  });

  // Handle Reset
  resetBtn.addEventListener("click", () => {
    resetPomodoro();
  });

  // Handle Mode selectors
  modeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      modeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const newMode = btn.getAttribute("data-mode");
      changePomodoroMode(newMode);
    });
  });
}

function startPomodoro() {
  const startBtn = document.getElementById("focusin-pomo-start");
  if (!startBtn) return;

  pomoIsRunning = true;
  startBtn.textContent = "⏸ Pause";
  startBtn.style.background = "#d97706"; // Amber color during timer running

  pomoInterval = setInterval(() => {
    pomoTimeLeft--;
    updatePomodoroDisplay();

    if (pomoTimeLeft <= 0) {
      triggerPomodoroAlarm();
      resetPomodoro();
    }
  }, 1000);
}

function pausePomodoro() {
  const startBtn = document.getElementById("focusin-pomo-start");
  if (!startBtn) return;

  pomoIsRunning = false;
  startBtn.textContent = "▶ Start";
  startBtn.style.background = ""; // Restore original stylesheet background

  if (pomoInterval) {
    clearInterval(pomoInterval);
    pomoInterval = null;
  }
}

function resetPomodoro() {
  pausePomodoro();
  pomoTimeLeft = POMO_DURATIONS[pomoMode];
  updatePomodoroDisplay();
}

function changePomodoroMode(mode) {
  pomoMode = mode;
  resetPomodoro();
}

function updatePomodoroDisplay() {
  const display = document.getElementById("focusin-pomo-display");
  if (!display) return;

  const minutes = Math.floor(pomoTimeLeft / 60);
  const seconds = pomoTimeLeft % 60;
  
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  
  display.textContent = `${paddedMinutes}:${paddedSeconds}`;
}

// Generate synthesizer sound when timer completes using HTML5 Web Audio API
function triggerPomodoroAlarm() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Play a dual-tone chime (C5 to E5 chord transition)
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    
    // Slide up to E5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.error("Audio Context alarm trigger failed", err);
  }
}

// Initialize on page load
init();
