import { OFFER_DEADLINE_KEY, OFFER_WINDOW_MS } from "./products";

/**
 * Read or create the offer deadline in localStorage (key: h2ct_offer_deadline).
 * First visit: now + 24h. Refresh / later visits reuse the stored value.
 * A valid stored timestamp is never overwritten.
 */
export function getOrSetOfferDeadline(now = Date.now()): number {
  const existing = window.localStorage.getItem(OFFER_DEADLINE_KEY);
  if (existing) {
    const parsed = Number.parseInt(existing, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  const deadline = now + OFFER_WINDOW_MS;
  window.localStorage.setItem(OFFER_DEADLINE_KEY, String(deadline));
  return deadline;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
