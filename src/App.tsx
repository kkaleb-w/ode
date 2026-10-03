import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Home from "@/pages/Home";
import Photography from "@/pages/Photography";
import Code from "@/pages/Code";
import Rosaria from "@/pages/Rosaria";
import About from "@/pages/About";

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/code" element={<Code />} />
        <Route path="/rosaria" element={<Rosaria />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
