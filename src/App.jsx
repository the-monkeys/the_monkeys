import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home/Home";

import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import AdScript from "./AdScript";
import "./App.css";
import ProtectedRoute from "./common/utils/ProtectedRoute";
import Cookie from "./components/Cookie/Cookie";
import CookiePolicyPage from "./components/Footer/CookiePolicyPage";
import Footer from "./components/Footer/Footer";
import PrivacyPolicyPage from "./components/Footer/PrivacyPolicyPage";
import TermsOfUse from "./components/Footer/TermsOfUse";
import { Login } from "./pages/Auth/components/Login";
import { Register } from "./pages/Auth/components/Register";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <AnimatePresence exitBeforeEnter>
      <Navigation />
      <Toaster position="top-right" />
      {/* AdScript will add script tag to all the component present here */}
      <AdScript />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/termsofuse" element={<TermsOfUse />} />
          <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
          <Route path="/cookiepolicy" element={<CookiePolicyPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Cookie />
      <Footer />
    </AnimatePresence>
  );
}

export default App;
