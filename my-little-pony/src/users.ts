import { IUser } from "./gifts"

export const allUsers: IUser[] = [
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
].map((emoji, idx) => ({
  id: idx,
  name: emoji
}))

export function getCurrentUser (): IUser | null {
  if (typeof sessionStorage === "undefined") return null // not a browser no current user
  // picks a random user, and stores it on the session storage to preserve identity during hot reloads
  const currentUserId: IUser['id'] = parseInt(sessionStorage.getItem("user") || Math.round(Math.random() * (allUsers.length - 1)).toString(), 10)
  sessionStorage.setItem("user", currentUserId.toString())
  return allUsers[currentUserId]
}
