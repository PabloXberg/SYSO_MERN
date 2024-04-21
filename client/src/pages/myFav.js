import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext"
import SketchCard from "../components/SketchCard";

import DefaultImage from "../default-placeholder.png";
import SubUserNav from "../components/SubUserNav";
import { serverURL } from "../serverURL";




const MyFav = () => {

    //////////////////////////////////////////////////////////////////////////////// VARIABLES "STATE"
    // const [users, setUsers] = useState<Users>([]);
    const { user } = useContext(AuthContext);
    const [activeUser, setActiveUser] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const LikesArray = activeUser?.likes;
    const [ID, setID] = useState(activeUser?._id);


    const getUserById = async () => {
      //  console.log('id :>> ', id);
      const id = user?._id;
      setID(id);
      try {
        const response = await fetch(`${serverURL}users/id/${id}`);
        const result = await response.json();

        setActiveUser(result);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      getUserById();
    }, [user, SketchCard]);



  
  return (
      
   <> <SubUserNav/>
      <div className="">


         <div className="cardcontainer">
        {LikesArray &&
          LikesArray.map((sketch) => {
            return <SketchCard bolean={true} key={sketch._id} props={sketch} />;
          })}
      </div>




      </div>
      </>
    )
  }



export default MyFav