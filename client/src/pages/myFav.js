import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import SketchCard from "../components/SketchCard";
import SubUserNav from "../components/SubUserNav";
import { serverURL } from "../serverURL";
import { useFetch } from "../hooks/useFetch";

const MyFav = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  const { data: activeUser, refetch } = useFetch(
    userId ? `${serverURL}users/id/${userId}` : null
  );

  // Reverse the array so the most recently liked sketch shows first.
  // The backend pushes new likes to the end of the array, so without
  // .slice().reverse() the user sees their oldest like at the top.
  // .slice() avoids mutating the source array (good practice).
  const favorites = (activeUser?.likes || []).slice().reverse();

  return (
    <div className="myfav-container">
      <SubUserNav />
      <div className="cardcontainer">
        {favorites.map((sketch) => (
          <SketchCard
            key={sketch._id}
            props={sketch}
            onUpdate={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default MyFav;
