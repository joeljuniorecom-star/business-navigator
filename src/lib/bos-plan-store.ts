import type { BOSResult } from "@/data/v2/bos-schema";

const STORAGE_KEY = "business-fit-bos-result";
let currentResult: BOSResult | null = null;

export function saveBOSResult(result: BOSResult) {
  currentResult = result;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // The in-memory value still supports the current navigation if storage is unavailable.
  }
}

export function readBOSResult(): BOSResult | null {
  if (currentResult) return currentResult;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    currentResult = JSON.parse(raw) as BOSResult;
    return currentResult;
  } catch {
    return null;
  }
}

export function clearBOSResult() {
  currentResult = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore unavailable session storage.
  }
}
