// Named export to match: import { getRegionFromHost } from "../utils/getRegion";
export function getRegionFromHost(hostname) {
  const host = (
    hostname ?? (typeof window !== "undefined" ? window.location.hostname : "")
  ).toLowerCase();

  // Treat any .se host as Sweden
  if (
    host === "tropinord.se" ||
    host === "www.tropinord.se" ||
    host.endsWith(".se")
  ) {
    return "se";
  }
  return "intl";
}
