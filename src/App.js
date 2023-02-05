import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home/Home";
import { Legal } from "./pages/Legal/Legal";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdScript from "./AdScript";

function App() {
  return (
    <>
      <Navigation />
      {/* AdScript will add script tag to all the component present here */}
      <AdScript />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tos" element={<Legal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
