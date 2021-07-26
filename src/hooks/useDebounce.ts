/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useRef, useEffect } from 'react';

interface IDebounce {
  onDebounce: (value: string) => void;
  onClearDebounce: () => void;
}

export const useDebounce = (
  fn: (value: string) => void,
  delay: number,
): IDebounce => {
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, []);

  function onDebounce(value: string): void {
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
