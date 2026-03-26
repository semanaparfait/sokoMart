import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import ReduxProvider from '../components/ReduxProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'SokoMart – Rwanda\'s Local E-Commerce',
  description: 'Empowering small businesses and young entrepreneurs in Rwanda to sell online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans antialiased">
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
