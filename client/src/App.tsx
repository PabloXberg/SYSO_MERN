import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { AuthContextProvider } from "./contexts/AuthContext";
import NavStrap from "./components/NavTrap";
import BattleBanner from "./components/BattleBanner";
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
import Notifications from "./pages/Notifications";
import BattleAdmin from "./pages/BattleAdmin";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <BrowserRouter>
          {/* Banner sits between NavStrap and Routes — visible on every page
              when an active battle exists, hidden otherwise. */}
          <NavStrap />
          <BattleBanner />
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
            <Route path="notifications" element={<Notifications />} />
            <Route path="admin/battles" element={<BattleAdmin />} />
            <Route path="*" element={<Navigate to="/sketches" replace />} />
            <Route path="sponsors" element={<Sponsors />} />
            <Route path="contact" element={<Contact />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
