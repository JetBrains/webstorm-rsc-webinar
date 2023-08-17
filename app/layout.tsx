import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Card Database'
} satisfies Metadata;

export default function RootLayout({
  children
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
