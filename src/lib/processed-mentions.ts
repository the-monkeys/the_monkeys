/**
 * Deduplication store for processed mentions.
 */
const STORAGE_KEY = "monkeys_processed_mentions";
const MAX_STORED_IDS = 1000;
let processedIds = null;

async function loadFromStorage() {
  if (processedIds) return processedIds;
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const ids = result[STORAGE_KEY] ?? [];
    processedIds = new Set(ids);
  } catch { processedIds = new Set(); }
  return processedIds;
}

async function persistToStorage() {
  if (!processedIds) return;
  try {
    const ids = Array.from(processedIds).slice(-MAX_STORED_IDS);
    await chrome.storage.local.set({ [STORAGE_KEY]: ids });
  } catch {}
}

export async function isAlreadyProcessed(tweetId) {
  const ids = await loadFromStorage();
  return ids.has(tweetId);
}

let pendingWrites = 0;
export async function markProcessed(tweetId) {
  const ids = await loadFromStorage();
  if (ids.has(tweetId)) return;
  ids.add(tweetId);
  pendingWrites++;
  if (pendingWrites >= 5) { pendingWrites = 0; await persistToStorage(); }
}

export async function flushPending() {
  if (pendingWrites > 0) { pendingWrites = 0; await persistToStorage(); }
}
