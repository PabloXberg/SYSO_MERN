import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom';

type Props = {}

const Navbar = (props: Props) => {

  const { user, login, logout } = useContext(AuthContext);
  console.log('user :>> ', user);

  return (
    <div>
      <div>{user ? <p>User logged In!</p> : <p>No User! - Please Logg In!</p>}</div>
      <div>{user ? <button onClick={logout}>Log Out!</button> : <Link to='/login'>Please Logg In!</Link>}</div>
      <div><Link to='/'>Home Page</Link> </div>
    </div>
  )
}

export default Navbar