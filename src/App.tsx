import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import ShortScreens from "./components/ShortScreens";
import './App.css';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{opacity: 0,y: 0,filter: "blur(12px)",clipPath: "inset(100% 0 0 0 round 0px)",}}
        animate={{opacity: 1,scale: 1,y: 0,filter: "blur(0px)",clipPath: "inset(0% 0 0 0 round 0px)"}}
        exit={{opacity: 0,y: 0,filter: "blur(8px)",clipPath: "inset(0 0 100% 0 round 0px)"}}
        transition={{duration: .6,ease: [0.45, 0.1, 0.25, 1],}}
        style={{position: "relative",zIndex: 2,overflow: "hidden",}}
      >

        {/* actual page routes */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<ViewPost />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </motion.main>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ShortScreens>
          <div
            className="App"
            style={{
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#f7f3e9",
            }}
          >
            <Navigation />
            <AnimatedRoutes />
          </div>
        </ShortScreens>
      </AuthProvider>
    </Router>
  );
};

export default App;
