import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SketchCard from "../components/SketchCard";
import { serverURL } from '../../../server/utils/serverURL' 

const MyFav = () => {
  //////////////////////////////////////////////////////////////////////////////// VARIABLES "STATE"
  // const [users, setUsers] = useState<Users>([]);
  const { user } = useContext(AuthContext);
  const [activeUser, setActiveUser] = useState(null);
  // eslint-disable-next-line
  const [show, setShow] = useState(false);
  const LikesArray = activeUser?.likes;
  // eslint-disable-next-line
  const [ID, setID] = useState(activeUser?._id);

  const getUserById = async () => {
    //  console.log('id :>> ', id);
    const id = user?._id;
    setID(id);
    try {
      const response = await fetch(
        `${serverURL}users/id/${id}`
      );
      const result = await response.json();

      setActiveUser(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="cardcontainer">
        {LikesArray &&
          LikesArray.map((sketch) => {
            return <SketchCard bolean={true} key={sketch._id} props={sketch} />;
          })}
      </div>
    </div>
  );
};

export default MyFav;
