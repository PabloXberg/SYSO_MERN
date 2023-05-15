import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import NavStrap from './components/NavTrap';
import Events from './pages/events';
import Sketches from './pages/sketches';
import UsersPage from './pages/users';
import MySketchs from './pages/mySketchs';
import MyFav from './pages/myFav';
import EditProfile from './pages/editProfile';

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <NavStrap/>
        <Routes>
          <Route path='/' element={ <Homepage />} />
          <Route path='register' element={ <Register /> } />
          <Route path='login' element={<Login />} />
          <Route path='events' element={<Events />} />
          <Route path='sketches' element={<Sketches />} />
          <Route path='users' element={<UsersPage />} />
          <Route path='mysketchs' element={<MySketchs />} />
          <Route path='myfav' element={<MyFav />} />
          <Route path='edit' element={ <EditProfile /> } />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
