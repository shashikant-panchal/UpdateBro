import { useEffect, useState } from 'react';

export interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
}

export function useCountdown(initialSeconds = 5 * 3600 + 42 * 60 + 18): CountdownState {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : initialSeconds));
    }, 1000);
    return () => window.clearInterval(id);
  }, [initialSeconds]);

  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  return {
    hours: String(hrs).padStart(2, '0'),
    minutes: String(mins).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
    totalSeconds: secondsLeft,
  };
}
