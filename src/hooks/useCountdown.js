import { useEffect, useMemo, useState } from "react";

function getParts(targetMs) {
  const now = Date.now();
  const distance = Math.max(0, targetMs - now);
  const totalSeconds = Math.floor(distance / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

export function useCountdown(targetDate) {
  const targetMs = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [time, setTime] = useState(() => getParts(targetMs));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getParts(targetMs));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetMs]);

  return time;
}
