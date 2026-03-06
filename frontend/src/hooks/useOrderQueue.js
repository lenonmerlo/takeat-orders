import { useCallback, useEffect, useMemo, useState } from "react";
import {
  readOrderQueue,
  removeQueueItem,
  replaceOrderQueue,
  upsertQueueItem,
} from "../services/orderQueueStorage";
import { createOrder } from "../services/ordersService";
import {
  isNetworkError,
  mapOrderApiErrorToMessage,
} from "../utils/orderErrors";

function buildQueueId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `queue-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function useOrderQueue() {
  const [queueItems, setQueueItems] = useState(() => readOrderQueue());
  const [isSyncing, setIsSyncing] = useState(false);

  const updateQueue = useCallback((nextQueue) => {
    replaceOrderQueue(nextQueue);
    setQueueItems(nextQueue);
  }, []);

  const enqueueOrder = useCallback((payload) => {
    const queued = {
      id: buildQueueId(),
      payload,
      status: "pending",
      errorMessage: "",
      syncedOrderId: null,
      attempts: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    const nextQueue = upsertQueueItem(queued);
    setQueueItems(nextQueue);
    return queued;
  }, []);

  const dismissQueueItem = useCallback((itemId) => {
    const nextQueue = removeQueueItem(itemId);
    setQueueItems(nextQueue);
  }, []);

  const clearSynced = useCallback(() => {
    const nextQueue = readOrderQueue().filter(
      (item) => item.status !== "synced",
    );
    updateQueue(nextQueue);
  }, [updateQueue]);

  const syncQueue = useCallback(async () => {
    if (isSyncing) return;

    const online = typeof navigator === "undefined" ? true : navigator.onLine;
    if (!online) return;

    const current = readOrderQueue();
    if (!current.length) return;

    setIsSyncing(true);

    try {
      let nextQueue = [...current];

      for (const item of nextQueue) {
        if (item.status === "synced") continue;

        const syncingItem = {
          ...item,
          status: "syncing",
          updatedAt: nowIso(),
        };

        nextQueue = nextQueue.map((entry) =>
          entry.id === syncingItem.id ? syncingItem : entry,
        );
        updateQueue(nextQueue);

        try {
          const order = await createOrder(syncingItem.payload);

          const syncedItem = {
            ...syncingItem,
            status: "synced",
            syncedOrderId: order.id,
            errorMessage: "",
            attempts: Number(syncingItem.attempts ?? 0) + 1,
            updatedAt: nowIso(),
          };

          nextQueue = nextQueue.map((entry) =>
            entry.id === syncedItem.id ? syncedItem : entry,
          );
          updateQueue(nextQueue);
        } catch (error) {
          if (isNetworkError(error)) {
            const pendingItem = {
              ...syncingItem,
              status: "pending",
              attempts: Number(syncingItem.attempts ?? 0) + 1,
              updatedAt: nowIso(),
            };

            nextQueue = nextQueue.map((entry) =>
              entry.id === pendingItem.id ? pendingItem : entry,
            );
            updateQueue(nextQueue);
            break;
          }

          const failedItem = {
            ...syncingItem,
            status: "failed",
            errorMessage: mapOrderApiErrorToMessage(error),
            attempts: Number(syncingItem.attempts ?? 0) + 1,
            updatedAt: nowIso(),
          };

          nextQueue = nextQueue.map((entry) =>
            entry.id === failedItem.id ? failedItem : entry,
          );
          updateQueue(nextQueue);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, updateQueue]);

  useEffect(() => {
    const handleOnline = () => {
      syncQueue();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
    }

    syncQueue();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
      }
    };
  }, [syncQueue]);

  const pendingCount = useMemo(
    () => queueItems.filter((item) => item.status === "pending").length,
    [queueItems],
  );

  const failedCount = useMemo(
    () => queueItems.filter((item) => item.status === "failed").length,
    [queueItems],
  );

  return {
    queueItems,
    isSyncing,
    pendingCount,
    failedCount,
    enqueueOrder,
    syncQueue,
    dismissQueueItem,
    clearSynced,
  };
}
