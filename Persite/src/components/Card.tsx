import type { ReactNode } from 'react';
import '../card.css';

type CardProps = {
  title: string;
  eyebrow?: string;
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function Card({
  title,
  eyebrow,
  id,
  className = '',
  children,
}: CardProps) {
  return (
    <section id={id} className={`card ${className}`.trim()}>
      {eyebrow && <span className="card-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children}
    </section>
  );
}
