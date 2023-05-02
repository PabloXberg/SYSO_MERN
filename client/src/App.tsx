import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';


interface User {
  _id: string,
  email: string,
  username: string,
  password: string
}

type Users = User[]

function App() {
  const [users, setUsers] = useState <null | Users>([]);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/all")
      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsers();
  },[])
  
  return (
    <> <div className="App">
      <h1>Hellooo!!!!</h1>
      {users && users.map((user) => {

        return <p key={user._id}>{user.username}</p>
      })}
    </div>
      <BrowserRouter>
        <Routes>
          <Route path='register' element={<Register/>} />
        </Routes>
      
      </BrowserRouter>
    </>
   
  );
}

export default App;
