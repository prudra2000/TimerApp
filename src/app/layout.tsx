import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TimerProvider } from "@/context/TimerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timer App",
  description: "A simple and elegant timer application",
  icons: {
    icon: [
      { url: '/icons8-clock-material-outlined-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons8-clock-material-outlined-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons8-clock-material-outlined-96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/icons8-clock-material-outlined-120.png', sizes: '120x120', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TimerProvider>{children}</TimerProvider>
      </body>
    </html>
  );
}
