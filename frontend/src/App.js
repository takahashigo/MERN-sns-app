import Home  from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Navigate, Route,Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./state/AuthContext";



function App() {
  // useContextを使うことによってどこからでもユーザーの情報を取ってくることができ、ユーザー情報の有無でコンポーネントを切り替えられる
  const {user} = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
