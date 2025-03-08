import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import TestChat from "../pages/TestChat";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/testchat" element={<TestChat />} />
      </Routes>
    </Router>
  );
};

export default App;
