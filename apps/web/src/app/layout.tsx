import type { Metadata } from "next";

import "@/styles/styles.css";
import "@/styles/globals.css";
import { TimerProvider } from "@/components/TimerProvider";

export const metadata: Metadata = {
  title: "Pomodoro",
  description: "A web pomodoro clock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/logo.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <TimerProvider>{children}</TimerProvider>
      </body>
    </html>
  );
}
