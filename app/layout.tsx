import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const robotoFont = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Your note-taking app',
  openGraph: {
    title: 'NoteHub',
    description: 'NoteHub your note-taking app',
    url: 'https://08-zustand-cb62s4pal-rodometovayas-projects.vercel.app',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview Image',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoFont.variable}`}
      >
        <TanStackProvider>
          <AuthProvider>
            <div className="layout">
              <Header />
              <main className="main">
                {children} {modal}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
