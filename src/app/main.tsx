import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "reflect-metadata";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";

import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

import { ThemeProvider } from "@/context/ThemeContext.tsx";
import QueryProvider from "@/context/QueryProvider.tsx";
import { AppWrapper } from "@/context/AppProviders.tsx";
import { Buffer } from "buffer";

(window as any).Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryProvider>
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
      </QueryProvider>
    </PersistGate>
  </Provider>,
);
