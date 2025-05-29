import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lottie React v3 Testing",
  description: "Testing environment for lottie-react v3 development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd',
          marginBottom: '2rem'
        }}>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
              Lottie React v3 Testing
            </h1>
            <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
              <Link
                href="/"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Home
              </Link>
              <Link
                href="/lottie-web"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Lottie Web (Raw)
              </Link>
              <Link
                href="/lottie-react"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Lottie React
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
