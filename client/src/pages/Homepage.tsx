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
    
    <> <div className='homepagebody'>

 
      <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div>
      {/* <div  style={{height: "300rem", width:"300rem"}}  data-mc-src="1e4910b0-cdf4-4801-a086-0410dd17529c#instagram"></div>

      <div style={{height: "300rem", width:"300rem"}}  data-mc-src="5040ac82-9e28-4d67-91ba-e217d9f70718#instagram"></div>


      <div style={{ height: "300rem", width: "300rem" }} data-mc-src="09bc956d-f65d-4cdf-82cf-916a6dd08e64#instagram"></div>
      
      <div style={{ height: "300rem", width: "300rem" }} data-mc-src="a345aceb-034a-4f4b-a002-df19a4c86617#instagram"></div> */}
    
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