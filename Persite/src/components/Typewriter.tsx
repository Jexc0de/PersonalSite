import { useState, useEffect } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  delay?: number;
};

export default function Typewriter({
  text,
  speed = 55,
  delay = 400,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setCount(reduce ? text.length : 0);
  }, [text]);


  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(
      () => setCount((c) => c + 1),
      count === 0 ? delay : speed
    );
    return () => window.clearTimeout(id);
  }, [count, done, speed, delay]);

  return (

    <p className="typewriter" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="caret" aria-hidden="true" />
    </p>
  );
}