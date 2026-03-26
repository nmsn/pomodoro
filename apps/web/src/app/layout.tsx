import type { Metadata } from "next";

import "@/styles/styles.css";
import "@/styles/globals.css";
import { TimerProvider } from "@/components/TimerProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getServerUserSettings } from "@/lib/server-settings";

export const metadata: Metadata = {
  title: "Pomodoro",
  description: "A web pomodoro clock",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 服务端加载用户设置，避免客户端闪烁
  const settings = await getServerUserSettings();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <ThemeProvider serverSettings={settings}>
          <TimerProvider>{children}</TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}