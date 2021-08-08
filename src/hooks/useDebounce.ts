/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useRef, useEffect } from 'react';

interface IDebounce {
  onDebounce: (value: any) => void;
  onClearDebounce: () => void;
}

export const useDebounce = (
  fn: (value: any) => void,
  delay: number,
  continueUnmounted?: boolean, // if want to continue to update after unmounted
): IDebounce => {
  const ref = useRef<number | undefined | null>(null);

  useEffect(() => {
    return () => {
      if (ref.current && !continueUnmounted) window.clearTimeout(ref.current);
    };
  });

  async function onDebounce(value: any): Promise<void> {
    if (ref.current) {
      await window.clearTimeout(ref.current);
    }

    const timeout = await window.setTimeout(() => {
      fn(value);
    }, delay);
    ref.current = timeout;
  }

  function onClearDebounce(): void {
    if (ref.current) window.clearTimeout(ref.current);
  }

  return { onDebounce, onClearDebounce };
};
