"use strict";
exports.__esModule = true;
exports.allUsers = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐒",
    "🦇",
    "🦉",
    "🦅",
    "🦆",
    "🐦",
    "🐧",
    "🐔",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐜",
    "🐢"
].map(function (emoji, idx) { return ({
    id: idx,
    name: emoji
}); });
function getCurrentUser() {
    if (typeof sessionStorage === "undefined")
        return null; // not a browser no current user
    // picks a random user, and stores it on the session storage to preserve identity during hot reloads
    var currentUserId = parseInt(sessionStorage.getItem("user") || Math.round(Math.random() * (exports.allUsers.length - 1)).toString(), 10);
    sessionStorage.setItem("user", currentUserId.toString());
    return exports.allUsers[currentUserId];
}
exports.getCurrentUser = getCurrentUser;
