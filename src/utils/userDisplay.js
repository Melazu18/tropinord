// src/utils/userDisplay.js
export function displayName(user) {
  if (!user) return "";
  return user.name?.trim() || user.handle || user.email?.split("@")[0] || "—";
}

// neutral generated avatar (no DB change required)
export function avatarUrl(user, size = 64) {
  // If you later add user.avatarUrl, prefer it here:
  if (user?.avatarUrl) return user.avatarUrl;

  const seed = (user?.name || user?.handle || user?.email || "TN").replace(
    /\s+/g,
    "_"
  );
  // DiceBear initials png
  return `https://api.dicebear.com/7.x/initials/png?size=${size}&seed=${encodeURIComponent(
    seed
  )}`;
}
