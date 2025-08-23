import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import "keen-slider/keen-slider.min.css";
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);
