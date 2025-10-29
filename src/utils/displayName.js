// src/utils/displayName.js
export function maskEmail(email = "") {
  const [u, d] = String(email).split("@");
  if (!u || !d) return email || "Account";
  const head = u.slice(0, 2);
  return `${head}${"*".repeat(Math.max(u.length - 2, 1))}@${d}`;
}

export function getDisplayName(user) {
  return user?.handle || maskEmail(user?.email) || "Account";
}
