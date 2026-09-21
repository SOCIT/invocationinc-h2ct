"use client";

import { useEffect, useState } from "react";
import { formatCountdown, getOrSetOfferDeadline } from "@/lib/countdown";

interface CountdownProps {
  className?: string;
  id?: string;
}

export function Countdown({ className = "", id }: CountdownProps) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getOrSetOfferDeadline();
    const tick = () => {
      setRemainingMs(Math.max(0, deadline - Date.now()));
    };
    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, []);

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
