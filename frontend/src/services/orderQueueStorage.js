const ORDER_QUEUE_STORAGE_KEY = "takeat.order.queue.v1";

function parseQueue(raw) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function readOrderQueue() {
  const storage = getStorage();
  if (!storage) return [];

  return parseQueue(storage.getItem(ORDER_QUEUE_STORAGE_KEY));
}

export function writeOrderQueue(queue) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(ORDER_QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

export function upsertQueueItem(item) {
  const queue = readOrderQueue();
  const index = queue.findIndex((entry) => entry.id === item.id);

  if (index >= 0) {
    queue[index] = item;
  } else {
    queue.push(item);
  }

  writeOrderQueue(queue);
  return queue;
}

export function removeQueueItem(itemId) {
  const queue = readOrderQueue().filter((entry) => entry.id !== itemId);
  writeOrderQueue(queue);
  return queue;
}

export function replaceOrderQueue(queue) {
  writeOrderQueue(queue);
  return queue;
}
