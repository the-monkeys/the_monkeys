import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home/Home";
import { Legal } from "./pages/Legal/Legal";
import "./index.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/components/Login";
import { Register } from "./pages/Auth/components/Register";
import AdScript from "./AdScript";
import "izitoast-react/dist/iziToast.css";
import { ArticleEditor } from "./pages/ArticleEditor/ArticleEditor";
import Membersmain from "./components/Contributors/MembersMain";
import Profile from "./components/Profile/Profile";
import Logout from "./components/Profile/Logout";
import Settings from "./components/Profile/Setting";
import Dropdown from "./components/Profile/Dropdown";

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
        <Route path="/article-editor" element={<ArticleEditor />} />
        <Route path="/meet-the-monkeys" element={<Membersmain />} />
        <Route path="/dropdown" element={<Dropdown />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
