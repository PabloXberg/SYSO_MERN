import React, { Key, useEffect, useState } from 'react'
import '../index.css'
import SketchCard from '../components/SketchCard'
import SubHomeNav from '../components/SubHomeNav'
import { serverURL } from '../serverURL'


type Props = {}

interface Sketch {
  _id: Key | null | undefined
  name: String,
  owner: String,
  comment: String,
  url: String,
  likes: [],
  comments:[]
}

type Sketches = Sketch[]

const SkechesPage = (props: Props) => {
  
 const [sketches, setSketches] = useState <Sketches>([]);

  
  
  const getSketches = async () => {
    try {
      const response = await fetch(`${serverURL}sketches/all`)
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
       
       <div className='cardcontainer'>
           {sketches && sketches.map((sketch: Sketch) => {
             return <SketchCard bolean={false} key={sketch._id} props={sketch} />
         })}
        </div>
                      
      </>
    </div>
  )
}

export default SkechesPage