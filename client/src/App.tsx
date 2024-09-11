import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Register from './pages/Register';
import Homepage from './pages/Homepage';
import { AuthContextProvider } from './contexts/AuthContext';
import NavStrap from './components/NavTrap';
import Sketches from './pages/sketches';

import UsersPage from './pages/users';
import MySketchs from './pages/mySketchs';
import MyFav from './pages/myFav';
import EditProfile from './components/editProfile';
import SketchDetail from './pages/SketchDetail';
import Battle from './pages/battle';
import ActualBattle from './pages/actualbattle';
import BattleHistory from './pages/battlehistory';
import News from './pages/news';

function App() {

  return (
    <div > 
          <AuthContextProvider>
              <BrowserRouter>
                <NavStrap/>
                  <Routes>
                    <Route path='/' element={ <Homepage />} />
                    {/* <Route path='register' element={ <Register /> } /> */}
                    <Route path='sketchdetail/:id' element={<SketchDetail/>}/>
                    <Route path='sketches' element={<Sketches />} />

                    <Route path='users' element={<UsersPage />} />
                    <Route path='mysketchs' element={<MySketchs />} />
                    <Route path='myfav' element={<MyFav/>} />
                    <Route path='edit' element={<EditProfile />} />
                    {/* <Route path='shop' element={<Shop/>} /> */}
            <Route path='battle' element={<Battle />} />
            <Route path='battlehistory' element={<BattleHistory />} />
            <Route path='actualbattle' element={<ActualBattle />} />
                    <Route path='news' element={<News/>}/>
                  </Routes>
              </BrowserRouter>
          </AuthContextProvider>
    </div>

  );
}

export default App;
