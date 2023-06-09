import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from './pages/register';
import Homepage from "./pages/Homepage";
import { AuthContextProvider } from "./contexts/AuthContext";
import NavStrap from "./components/NavTrap";
import Sketches from "./pages/sketches";
import UsersPage from "./pages/users";
import MySketchs from "./pages/mySketchs";
import MyFav from "./pages/myFav";
import EditProfile from "./pages/editProfile";
import SketchDetail from "./pages/SketchDetail";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <BrowserRouter>
          <NavStrap />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="sketchdetail/:id" element={<SketchDetail />} />
            <Route path="sketches" element={<Sketches />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="mysketchs" element={<MySketchs />} />
            <Route path="myfav" element={<MyFav />} />
            <Route path="edit" element={<EditProfile />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
