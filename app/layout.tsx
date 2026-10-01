import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import DemoBanner from '@/components/DemoBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinTrack — Panel de Finanzas Personales',
  description: 'Visualiza tus ingresos, gastos, presupuestos y tipos de cambio en tiempo real.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <DemoBanner />
        <div className="flex-1">
          {children}
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </body>
    </html>
  );
}