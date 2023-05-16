import React, { Key, useEffect, useState } from 'react'

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

const Homepage = (props: Props) => {
  const [users, setUsers] = useState<Users>([]);
  const [user, setUser] = useState<User | null>(null);

  const getUsers = async() => {
    try {
      const response = await fetch("http://localhost:5000/api/users/all");
      const result = await response.json();
      setUsers(result);
      console.log("all users:", result)
    } catch (error) {
      console.log(error);
    }
  }

  const getUserById = async() => {
    const id = "6447a2bc1362e69f068f823b";
    try {
      const response = await fetch(`http://localhost:5000/api/users/id/${id}`);
      const result = await response.json();
      console.log("single user:", result);
      setUser(result);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // getUsers();
    // getUserById();
  }, [])

  return (
    <div></div>
    // <> <div className="App">
    //   <h1>Hellooo!!!!</h1>
    //   {users && users.map((user) => {

    //     return <p key={user._id}>{user.username}</p>
    //   })}
    // </div>
                  
    // </>
  );
}

export default Homepage