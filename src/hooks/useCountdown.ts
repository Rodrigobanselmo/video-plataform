/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useRef, useEffect } from 'react';

interface ICountdownHook {
  ref: any;
  action: {
    setTimer: (time: number) => void;
    clearTimer: () => void;
    msToTime: (time: number) => void;
  };
}

export const useCountdown = (onComplete: () => void): ICountdownHook => {
  const refDate = useRef<HTMLParagraphElement>(null);
  const refTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (refTimeout.current) clearInterval(refTimeout.current);
    };
  }, []);

  function msToTime(duration: number) {
    const milliseconds = Math.floor((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hoursText = hours < 10 ? `0${hours}` : hours;
    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    const secondsText = seconds < 10 ? `0${seconds}` : seconds;

    // const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    // const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return {
      hours: hoursText,
      minutes: minutesText,
      seconds: secondsText,
      milliseconds,
    };
  }

  function setTimer(time: number): void {
    const actualTime = new Date().getTime();
    const isDate = time > actualTime;
    const countdownTime = isDate ? time : actualTime + time;

    refTimeout.current = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = countdownTime - now;

      // get string date
      const date = msToTime(timeLeft);

      // Result is output to the specific element
      if (refDate?.current) {
        if (date.hours === '00')
          refDate.current.innerHTML = `${date.minutes}:${date.seconds}`;
        else
          refDate.current.innerHTML = `${date.hours}:${date.minutes}:${date.seconds}`;
      }

      if (timeLeft < 0) {
        if (refTimeout.current) clearInterval(refTimeout.current);
        if (refDate?.current) refDate.current.innerHTML = '00:00';
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  function clearTimer(): void {
    if (refTimeout.current) clearInterval(refTimeout.current);
  }

  return { ref: refDate, action: { setTimer, clearTimer, msToTime } };
};
