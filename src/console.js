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
    } else {
        root.classList.add("dark");
    }
}