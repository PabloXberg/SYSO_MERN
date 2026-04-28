import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { AuthContextProvider } from "./contexts/AuthContext";
import NavStrap from "./components/NavTrap";
import Sketches from "./pages/sketches";
import UsersPage from "./pages/users";
import MySketchs from "./pages/mySketchs";
import MyFav from "./pages/myFav";
import EditProfile from "./components/editProfile";
import SketchDetail from "./pages/SketchDetail";
import Battle from "./pages/battle";
import ActualBattle from "./pages/actualbattle";
import BattleHistory from "./pages/battlehistory";
import News from "./pages/news";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import Notifications from "./pages/Notifications"; // NEW

function App() {
  return (
    <div>
      <AuthContextProvider>
        <BrowserRouter>
          <NavStrap />
          <Routes>
            <Route path="/" element={<Navigate to="/sketches" />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="sketchdetail/:id" element={<SketchDetail />} />
            <Route path="sketches" element={<Sketches />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="mysketchs" element={<MySketchs />} />
            <Route path="myfav" element={<MyFav />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="battle" element={<Battle />} />
            <Route path="battlehistory" element={<BattleHistory />} />
            <Route path="actualbattle" element={<ActualBattle />} />
            <Route path="news" element={<News />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="resetPassword/:token" element={<ResetPassword />} />
            <Route path="notifications" element={<Notifications />} /> {/* NEW */}
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
