# FocusIn: LinkedIn Career Accelerator 🚀

**FocusIn** is a premium, open-source productivity Chrome extension designed to transform your LinkedIn experience. Instead of losing hours scrolling through an Instagram-like home feed, FocusIn hides the distraction column and replaces it with a beautiful, high-fidelity **Career Accelerator Dashboard**—letting you focus on applying for jobs and building real connections.

Developed with modular design patterns, FocusIn features a sleek glassmorphic layout, a responsive three-column grid, interactive widgets, and seamless light/dark mode synchronization.

---

## 🎨 Visual Showcase

### Dark Mode (Default)
A premium dark-themed canvas featuring a dashed blueprint grid line pattern and glowing cyan targets.
![FocusIn Dark Mode](images/Dark-mode.png)

### Light Mode
A clean, high-contrast light theme built with sky-blue accents and slate-grey lines.
![FocusIn Light Mode](images/Light-mode.png)

### Focus Control (Popup Menu)
A compact dashboard popup with a master shield toggle, real-time distraction score statistics, and a theme switcher.
![Setting Menu](images/Setting-Menu.png)

---

## 📽️ Interactive Demos

* 📦 **[Watch the Extension Demo Video (MOV)](images/output.mov)** — See the blocker, Pomodoro timer, checklist, and live theme updates in action.
* 🛠️ **[Watch the Local Installation Guide (MOV)](images/How-to-install.mov)** — A video guide on loading the extension in Developer Mode.

---

## ✨ Key Features

1. **Intelligent Page Blocking**: Hides ONLY the distraction feed on `https://www.linkedin.com/feed/`. It keeps your navigation header visible and doesn't interfere when you click on search filters, jobs, or messages.
2. **Double-Sided Responsive Widgets**:
   - **Left Sidebar**: Highlights **Amit's Developer Tools** (with interactive project cards that redirect to your portfolio).
   - **Right Sidebar**: Features an interactive **Pomodoro Focus Timer** (supporting Focus/Break sessions and custom synthesized audio alerts upon expiration).
3. **Interactive Daily Checklist**: Plan and check off your daily job-hunting targets directly on the blocked feed page. Your checklist state persists across browser reloads using `chrome.storage.local`.
4. **Theme Syncing**: Instantly switch themes (Sun/Moon button) in the popup menu, and watch the entire LinkedIn overlay dashboard transition dynamically in real-time.
5. **Standard Assets**: Fully configured with standard PNG icons (`icon16.png`, `icon48.png`, `icon128.png`) to ensure clean rendering on Chrome's bookmark bar and extensions toolbar.

---

## ⚙️ How to Install and Run Locally (Developer Mode)

Since this project runs locally without requiring a Google Web Store registration fee, follow these simple steps to install it directly in Google Chrome:

1. **Clone/Download the Repository**:
   Download the zip file or clone this repository to a folder on your computer.

2. **Open Extensions Manager**:
   Open Google Chrome, navigate to:
   ```text
   chrome://extensions/
   ```

3. **Enable Developer Mode**:
   Toggle on the **Developer mode** switch in the upper-right corner of the Extensions page.

4. **Load the Unpacked Folder**:
   - Click the **Load unpacked** button in the top-left corner.
   - Select the main repository directory (the folder containing `manifest.json`, `content.js`, `styles.css`, `icons/`, etc.).

5. **Pin the Extension**:
   - Click the extensions puzzle icon next to your Chrome address bar.
   - Click the pin icon next to **FocusIn: LinkedIn Career Accelerator** to display the shield logo directly in your toolbar.

6. **Go to LinkedIn**:
   Visit `https://www.linkedin.com/feed/` to see your new dashboard. Click the extension toolbar icon to customize your settings and view your focus score!

---

## 🛠️ Developed By

* **Author**: Amit Prajapati (Senior Mobile Developer)
* **Portfolio**: 🌐 **[Explore My Works](https://amit-flutter.github.io/)**
* **Design Mantra**: *Made with ❤️ in India*
