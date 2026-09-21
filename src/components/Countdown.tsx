"use client";

import { useEffect, useState } from "react";
import { formatCountdown, getOrSetOfferDeadline } from "@/lib/countdown";

interface CountdownProps {
  className?: string;
  id?: string;
  /** Called once when the countdown reaches zero. */
  onExpire?: () => void;
}

export function Countdown({ className = "", id, onExpire }: CountdownProps) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getOrSetOfferDeadline();
    let fired = false;
    const tick = () => {
      const remaining = Math.max(0, deadline - Date.now());
      setRemainingMs(remaining);
      if (remaining <= 0 && !fired) {
        fired = true;
        onExpire?.();
      }
    };
    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, [onExpire]);

  return (
    <time
      id={id}
      className={className}
      dateTime={
        remainingMs === null ? undefined : `PT${Math.floor(remainingMs / 1000)}S`
      }
      aria-label="offer countdown"
    >
      {remainingMs === null ? "24:00:00" : formatCountdown(remainingMs)}
    </time>
  );
}
