import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/styles.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 禁用双指放大
    document.documentElement.addEventListener(
      'touchstart',
      function (event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      {
        passive: false,
      },
    );

    // 禁用双击放大
    let lastTouchEnd = 0;
    document.documentElement.addEventListener(
      'touchend',
      function (event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      {
        passive: false,
      },
    );
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport " content="user-scalable=0 " />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
          name="viewport"
        />
        <meta name="apple-mobile-web-app-capable " content="yes " />
        <title>Pomodoro</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
