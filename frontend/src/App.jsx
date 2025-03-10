import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ChatPage from "../pages/ChatPage";
import SignUpPage from "../pages/SignUpPage";
import SignInPage from "../pages/SignInPage";
import DeepChatPage from "../pages/DeepChatPage";
import { LocationProvider } from "./components/ContextProvider";

const App = () => {
  return (
    <LocationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/deepchat" element={<DeepChatPage />} />
        </Routes>
      </Router>
    </LocationProvider>
  );
};

export default App;
