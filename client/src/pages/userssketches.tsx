import React, { Key, useEffect, useState } from 'react'
import '../index.css'
import SketchCard from '../components/SketchCard'
import SubHomeNav from '../components/SubHomeNav'


type Props = {}

interface Sketch {
  _id: String | null | undefined;
  name: String;
  owner: any;
  comment: String;
  url: String | File;
  likes: [];
  comments: [];
}
type Sketches = Sketch[]

interface User {
  _id: String | null | undefined;
  email: String;
  username: String;
  password: String;
  info: String;
  sketchs: [];
  likes: [];
  comments: [];
}

type Users = User[];
type id = any;



const UsersSkeches = (props: any) => {
  
  const [sketches, setSketches] = useState<Sketches>([]);
  
console.log(props, "props");
  
  
  const getSketches = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}sketches/all`)
      const result = await response.json();
      setSketches(result);
      console.log("all users:", result)
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getSketches();

  }, [])

  return (
    <div>

      <><SubHomeNav/>
       
        <h1 style={{ textAlign: "center", fontSize: "xx-large", fontFamily: 'MiFuente' }}>Bocetos de ....</h1>
        
        <div className='cardcontainer'>
           {sketches && sketches.map((sketch: Sketch) => {
             return <SketchCard bolean={false} key={sketch._id} props={sketch} />
         })}
        </div>
                      
      </>
    </div>
  )
}

export default UsersSkeches