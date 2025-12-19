import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JIT Production Dashboard',
  description: 'Just-In-Time Manufacturing Production Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen overflow-y-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}

