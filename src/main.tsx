import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
//*=============== context provider
import { UserDataProvider } from "./components/AppContext/AppContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserDataProvider>
      <App />
    </UserDataProvider>
  </StrictMode>,
);
