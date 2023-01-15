import Navigation from "./Navigation/Navigation";
import About from "./Navigation/About";
import Contact from "./Navigation/Contact";
import "./index.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={App} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
