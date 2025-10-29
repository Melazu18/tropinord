import { useMemo } from "react";
import { getRegionFromHost } from "../utils/getRegion";

export default function useRegion() {
  return useMemo(() => getRegionFromHost(), []);
}
