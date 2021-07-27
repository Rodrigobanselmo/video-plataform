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
  continueUnmounted?: boolean,
): IDebounce => {
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (ref.current && !continueUnmounted) clearTimeout(ref.current);
    };
  }, []);

  function onDebounce(value: any): void {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      fn(value);
    }, delay);
  }

  function onClearDebounce(): void {
    if (ref.current) window.clearTimeout(ref.current);
  }

  return { onDebounce, onClearDebounce };
};
