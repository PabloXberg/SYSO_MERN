import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import NavStrap from './components/NavTrap';
import Sketches from './pages/sketches';
import UsersSketches from './pages/userssketches';
import UsersPage from './pages/users';
import MySketchs from './pages/mySketchs';
import MyFav from './pages/myFav';
import EditProfile from './pages/editProfile';
import SketchDetail from './pages/SketchDetail';
import Battle from './pages/battle';

function App() {

  return (
    <div > 
          <AuthContextProvider>
              <BrowserRouter>
                <NavStrap/>
                  <Routes>
                    <Route path='/' element={ <Homepage />} />
                    <Route path='register' element={ <Register /> } />
                    <Route path='sketchdetail/:id' element={<SketchDetail/>}/>
                    <Route path='sketches' element={<Sketches />} />
                    <Route path='userssketches' element={<UsersSketches/>} />
                    <Route path='users' element={<UsersPage />} />
                    <Route path='mysketchs' element={<MySketchs />} />
                    <Route path='myfav' element={<MyFav/>} />
                    <Route path='edit' element={<EditProfile />} />
                    {/* <Route path='shop' element={<Shop/>} /> */}
                    <Route path='battle' element={ <Battle /> } />
                  </Routes>
              </BrowserRouter>
          </AuthContextProvider>
    </div>

  );
}

export default App;
