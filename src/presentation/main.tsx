import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "reflect-metadata";
import { Provider } from "react-redux";
import { store, persistor } from "../presentation/redux/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";

import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { AppWrapper } from "../presentation/components/admin/common/PageMeta.tsx";
import { ThemeProvider } from "../presentation/context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
