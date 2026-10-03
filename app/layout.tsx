import type { Metadata } from 'next';
import './globals.css';
import WhatsAppButton from '@/components/marketing/WhatsAppButton';

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
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
