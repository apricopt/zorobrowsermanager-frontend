import './globals.css';

export const metadata = {
  title: 'Zoro Browser Manager',
  description: 'Professional browser profile management and automation',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {children}
      </body>
    </html>
  );
}