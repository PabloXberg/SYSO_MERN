
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import SketchCard from '../components/SketchCard'
import { Button } from 'react-bootstrap'

type Props = {}

interface Sketch {
  _id: String | null | undefined
  name: String,
  owner: String,
  comment: String,
  url: String,
  likes: [],
  comments:[]
}

interface User {
  _id: String | null | undefined
  email: String,
  username: String,
  password: String,
  info: String,
  sketchs: [],
  likes: [],
  comments:[]
}

type Users = User[]

const MySketchs = (props: Props) => {

const { user, login, logout } = useContext(AuthContext);
// console.log('user :>> ', user);


const [users, setUsers] = useState<Users>([]);
const [acitveUser, setActiveUser] = useState<User | null>(null);

const getUserById = async() => {
    const id = user?._id
    try {
      const response = await fetch(`http://localhost:5000/api/users/id/${id}`);
      const result = await response.json();
      console.log("single user:", result);
      setActiveUser(result);
      // console.log('set Active User :>> ', result);
    } catch (error) {
      console.log(error)
    }
  }
   useEffect(() => {
    getUserById();
  }, [user])


  const sketchsArray = acitveUser?.sketchs;

  return (
    <div>
      <div style={{display: "flex", alignItems:"center", justifyContent: "center"}} className="title">
              <h1 style={{ textAlign: "center" }}>mySketchs</h1>
      <Button className='primary'>New Sketch</Button>
      </div>

      <div className="cardcontainer">
        
        {sketchsArray && sketchsArray.map((sketch: Sketch) => {
          return <SketchCard key={sketch._id} props={sketch} />
        })}
    </div>
    </div>
  )
}

export default MySketchs