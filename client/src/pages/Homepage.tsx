import React, { Key, useEffect, useState } from 'react'
import '../../src/index.css'
import { InstagramEmbed } from 'react-social-media-embed';

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


  // +++++++++++ PARA BUSCAR UN USUARIO EN PARTICULAR
  // const getUserById = async() => {
  //   const id = "6447a2bc1362e69f068f823b";
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/users/id/${id}`);
  //     const result = await response.json();
  //     console.log("single user:", result);
  //     setUser(result);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    // getUsers();
    // getUserById();
  }, [])

  return (
    
    <> <div className="background-image">
    
      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        
      <InstagramEmbed url="https://www.instagram.com/p/Cr5F6xMtbmm/" width={"100%"} />
    </div>
     */}
{/* 
     <iframe title= "IG"src="https://www.instagram.com/share_your_sketch/" ></iframe> */}
      
    </div>
                  
   </>
   )

 

}

export default Homepage