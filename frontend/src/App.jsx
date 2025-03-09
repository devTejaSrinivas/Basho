import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import TestChat from "../pages/TestChat";
import ChatPage from "../pages/ChatPage";
import SignUpPage from "../pages/SignUpPage";
import SignInPage from "../pages/SignInPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/testchat" element={<TestChat />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
