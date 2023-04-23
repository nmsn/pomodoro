import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store, wrapper } from '@/store';

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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
