
import { useRef, useEffect } from 'react'

export function useDebounce(fn,delay) {

    const ref = useRef(null)

    useEffect(() => {
      return () => {
        window.clearTimeout(ref.current);
      }
    }, [])

    function onDebounce(...props) {
        window.clearTimeout(ref.current);
        ref.current = window.setTimeout(() => {
          fn(...props)
        }, delay)
    }

    function onClearDebounce() {
        window.clearTimeout(ref.current);
    }


    return [onDebounce,onClearDebounce]
}

