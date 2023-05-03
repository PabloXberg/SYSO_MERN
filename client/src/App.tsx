import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Homepage />} />
          <Route path='register' element={ <Register /> } />
          <Route path='login' element={ <Login /> } />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
