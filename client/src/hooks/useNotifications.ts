import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { serverURL } from "../serverURL";

  export interface Notification {
    _id: string;
    type:
      | "like"
      | "comment"
      | "comment_reply"
      | "welcome"
      | "battle_voting"
      | "battle_finished"
      | "battle_winner_popular"
      | "battle_winner_jury";
    actor?: { _id: string; username: string; avatar: string } | null;
    sketch?: { _id: string; name: string; url: string } | null;
    battle?: { _id: string; theme: string; state: string } | null;
    read: boolean;
    createdAt: string;
  }

const POLL_INTERVAL_MS = 30_000; // 30 seconds

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Custom hook that:
 *   - fetches notifications from the server when the user logs in
 *   - polls the unread count every 30s while the user is active
 *   - exposes helpers to mark as read / remove
 *
 * Notifications are only fetched when there's a logged-in user.
 */
export function useNotifications(limit: number = 20): UseNotificationsResult {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const authHeaders = (): HeadersInit => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Full fetch — gets notifications + count
  const refresh = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${serverURL}notifications?limit=${limit}`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setError(null);
    } catch (err) {
      console.error("useNotifications refresh error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?._id, limit]);

  // Lightweight count-only fetch — used by the polling timer
  const refreshCount = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${serverURL}notifications/unread-count`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // Silent fail — polling shouldn't surface errors to the user
    }
  }, [user?._id]);

  // Initial fetch + polling
  useEffect(() => {
    if (!user?._id) {
      // User logged out — clear state
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refresh();
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user?._id, refresh, refreshCount]);

  // Mark a single notification as read
  const markRead = useCallback(
    async (id: string) => {
      try {
        await fetch(`${serverURL}notifications/${id}/read`, {
          method: "POST",
          headers: authHeaders(),
        });
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error("markRead error:", err);
      }
    },
    []
  );

  // Mark every notification as read
  const markAllRead = useCallback(async () => {
    try {
      await fetch(`${serverURL}notifications/read-all`, {
        method: "POST",
        headers: authHeaders(),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("markAllRead error:", err);
    }
  }, []);

  // Delete a notification
  const remove = useCallback(
    async (id: string) => {
      try {
        await fetch(`${serverURL}notifications/${id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        setNotifications((prev) => {
          const removed = prev.find((n) => n._id === id);
          if (removed && !removed.read) {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
          return prev.filter((n) => n._id !== id);
        });
      } catch (err) {
        console.error("remove error:", err);
      }
    },
    []
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
    remove,
  };
}
