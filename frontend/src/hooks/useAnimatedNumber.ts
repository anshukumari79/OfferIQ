import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/**
 * Returns a number that smoothly animates toward `target` whenever it
 * changes, using Framer Motion's animate() to tween the value and an
 * onUpdate callback to push each frame into React state. Skips the tween
 * on first mount so the number doesn't count up from zero on page load.
 */
export function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      setValue(target);
      return;
    }

    const controls = animate(value, target, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
