import React, { Key, useEffect, useState } from 'react'
import UserCard from '../components/UserCard'
import '../index.css'

type Props = {}

interface User {
  _id: Key | null | undefined
  email: String,
  username: String,
  password: String,
  info: String,
  sketchs: [],
  likes: [],
  comments:[]
}

type Users = User[]

const UsersPage = (props: Props) => {
 const [users, setUsers] = useState<Users>([]);
  const [user, setUser] = useState<User | null>(null);

   
  
  const getUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/all`)
      const result = await response.json();
      setUsers(result.users);
      console.log("all users:", result)
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getUsers();

  }, [])

  return (
    <div>

      <>
       
       <h1>All Registered Users</h1>
        <div className='cardcontainer'>
           {users && users.map((user: User) => {
            return <UserCard key={user._id} props={user} />
         })}
        </div>
                      
      </>
    </div>
  )
}

export default UsersPage