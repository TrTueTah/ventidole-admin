import { Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryProvider } from '@/context/QueryProvider';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { APP_CONFIG } from '@/constants/app.constant';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP_CONFIG.seo.title,
  description: APP_CONFIG.seo.description,
  icons: {
    icon: APP_CONFIG.logo.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
