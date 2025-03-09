import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import TestChat from "../pages/TestChat";
import ChatPage from "../pages/ChatPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/testchat" element={<TestChat />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
