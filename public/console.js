/**
 * General purpose console commands for testing with
 */

/**
 * Toggles the theme of the site
 */
function toggleTheme() {
    // check if the document has the dark class
    let root = document.getElementsByTagName("html")[0];
    if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        localStorage.setItem("isDark", "false");
    } else {
        root.classList.add("dark");
        localStorage.setItem("isDark", "true");
    }
}

/**
 * Runs commands on startup
 * Currently responsible for checking if dark mode
 */
function start() {
    const isDark = localStorage.getItem("isDark");
    if (isDark == "true") {
        let root = document.getElementsByTagName("html")[0];
        root.classList.add("dark");
    }
}