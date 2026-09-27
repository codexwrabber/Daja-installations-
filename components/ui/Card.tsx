import { HTMLAttributes } from 'react';

export default function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`card rounded-2xl shadow-card p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
