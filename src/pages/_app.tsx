import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store, wrapper, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

import "../styles/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
