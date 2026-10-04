"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { API_BASE_URL, apiRequest, hasActiveSession, onSessionChange } from "@/lib/api/client";

// Live plant events from Mahaurja-Backend (Phase 8.2, Server-Sent Events).
// One shared connection per browser tab; desks subscribe to the event types they show.

export interface PlantEvent<P = Record<string, unknown>> {
  id: number;
  type: string;
  entity: string;
  entityId: string;
  payload: P;
  createdAt: string;
}

type Listener = (event: PlantEvent) => void;
export type LiveStatus = "connecting" | "live" | "offline";

const listeners = new Map<string, Set<Listener>>(); // key: exact type or "prefix.*"
const statusListeners = new Set<() => void>();
let status: LiveStatus = "offline";
let controller: AbortController | null = null;
let lastEventId: number | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let retryDelay = 1000;
let active = false;

function setStatus(next: LiveStatus) {
  status = next;
  statusListeners.forEach((l) => l());
}

function dispatch(event: PlantEvent) {
  lastEventId = event.id;
  const prefix = `${event.type.split(".")[0]}.*`;
  for (const key of [event.type, prefix, "*"]) {
    listeners.get(key)?.forEach((listener) => listener(event));
  }
}

// Parses a text/event-stream body. We read it with fetch (not EventSource) so every named
// event type reaches us without registering a listener per type.
async function readStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });
    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const data = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (!data) continue; // heartbeat comment
      try {
        dispatch(JSON.parse(data) as PlantEvent);
      } catch {
        // ignore malformed frame
      }
    }
  }
}

async function connect() {
  if (!active || controller) return;
  setStatus("connecting");
  const abort = new AbortController();
  controller = abort;
  try {
    // The stream endpoint takes a single-use 60 s ticket; each reconnect needs a fresh one.
    const { ticket } = await apiRequest<{ ticket: string }>("/api/v1/events/ticket", { method: "POST" });
    const url = new URL(`${API_BASE_URL}/api/v1/events/stream`);
    url.searchParams.set("ticket", ticket);
    if (lastEventId !== null) url.searchParams.set("lastEventId", String(lastEventId));

    const res = await fetch(url, { signal: abort.signal, headers: { Accept: "text/event-stream" } });
    if (!res.ok || !res.body) throw new Error(`stream ${res.status}`);
    retryDelay = 1000;
    setStatus("live");
    await readStream(res.body);
  } catch {
    // network drop, server restart, or expired ticket — fall through to reconnect
  }
  if (controller === abort) controller = null;
  if (!abort.signal.aborted) scheduleReconnect();
}

function scheduleReconnect() {
  setStatus("offline");
  if (!active || retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void connect();
  }, retryDelay);
  retryDelay = Math.min(retryDelay * 2, 30_000);
}

function stop() {
  active = false;
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
  controller?.abort();
  controller = null;
  lastEventId = null;
  setStatus("offline");
}

// Start/stop the stream with the login session.
if (typeof window !== "undefined") {
  onSessionChange((session) => {
    if (session && !active) {
      active = true;
      void connect();
    } else if (!session) {
      stop();
    }
  });
}

// Covers a login that happened before this module was loaded (route code-splitting).
function ensureStarted() {
  if (!active && hasActiveSession()) {
    active = true;
    void connect();
  }
}

/** Subscribe a component to event types, e.g. ["users.*", "access_request.*"]. */
export function usePlantEvents(types: string[], handler: Listener) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const key = types.join("|");
  useEffect(() => {
    ensureStarted();
    const keys = key.split("|");
    const wrapped: Listener = (event) => handlerRef.current(event);
    for (const k of keys) {
      if (!listeners.has(k)) listeners.set(k, new Set());
      listeners.get(k)!.add(wrapped);
    }
    return () => keys.forEach((k) => listeners.get(k)?.delete(wrapped));
  }, [key]);
}

/** Connection state for the LIVE indicator. */
export function useLiveStatus(): LiveStatus {
  return useSyncExternalStore(
    (cb) => {
      ensureStarted();
      statusListeners.add(cb);
      return () => statusListeners.delete(cb);
    },
    () => status,
    () => "offline",
  );
}
