import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={App} />
        <Route path="/about" element={About} />
        <Route path="/contact" element={Contact} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
