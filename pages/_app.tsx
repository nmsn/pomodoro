// import '../styles/globals.css'
import "tailwindcss/tailwind.css";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
