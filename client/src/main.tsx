import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import Validate from "./pages/Validate";
import Cards from "./pages/Cards";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/validate" element={<Validate />} />
      <Route path="/cards" element={<Cards />} />
    </Routes>
  </BrowserRouter>
);
