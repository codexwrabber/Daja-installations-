import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daja Installation Services',
  description: 'Skilled hands. Quality work. Lasting solutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
