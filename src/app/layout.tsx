'use client';

import React, { ReactNode } from 'react';
import Head from 'next/head';

import '../styles/styles.css';
import '../styles/globals.css';

function MyApp({ children }: { children: ReactNode }) {
  return (
    <html>
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
      <body>{children}</body>
    </html>
  );
}

export default MyApp;
