import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lottie React Example",
  description: "A simple example of using Lottie with React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
