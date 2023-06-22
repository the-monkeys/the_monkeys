// import { Navigation } from "./components/Navigation";
import Navigation from "./components/Navigation/Nav2";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home/Home";
import { Legal } from "./pages/Legal/Legal";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/components/Login";
import { Register } from "./pages/Auth/components/Register";
import { ArticleEditor } from "./pages/ArticleEditor/ArticleEditor";
import QuillEditor from "./pages/QuillEditor/QuillEditor";
import AdScript from "./AdScript";
import Membersmain from "./components/Contributors/MembersMain";
import ProtectedRoute from "./common/utils/ProtectedRoute";
import { Profile } from "./pages/Profile";

import { Settings } from "./pages/Settings";
import "./index.css";
import "./App.css";
import "izitoast-react/dist/iziToast.css";

function App() {
  return (
    <>
      <Navigation />
      {/* AdScript will add script tag to all the component present here */}
      <AdScript />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tos" element={<Legal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/write/:id"
            element={
              <ProtectedRoute>
                <ArticleEditor />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/type/:id"
            element={
              <ProtectedRoute>
                <QuillEditor />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/meet-the-monkeys" element={<Membersmain />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />{" "}
              </ProtectedRoute>
            }
          />
          {/* <Route path="/profile" element={<ProtectedRoute > <Profile /> </ProtectedRoute>} /> */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
