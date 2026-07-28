import type { ReactNode } from 'react';


type DemoShellProps = {
  title: string;
  controls?: ReactNode;
  children: ReactNode;
};

export default function DemoShell({
  title,
  controls,
  children,
}: DemoShellProps) {
  return (
    <figure className="demo-shell">
      <div className="demo-shell-stage">{children}</div>
      {controls && <div className="demo-shell-controls">{controls}</div>}
      <figcaption className="demo-shell-title">{title}</figcaption>
    </figure>
  );
}