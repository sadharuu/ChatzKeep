import { Work_Sans } from 'next/font/google'; 
import './globals.css';
import { SocketProvider } from '@/context/SocketContext';


const mainFont = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-main',
});


export const metadata = {
  title: 'ChatzKeep',
  description: 'Healthcare Recruitment Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${mainFont.variable} font-custom antialiased`}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}