import  { Key, useEffect, useState } from "react";

import "../index.css";
import {serverURL} from '../../../server/utils/serverURL' 
import SketchCard from "../components/SketchCard";

type Props = {};

interface Sketch {
  _id: Key | null | undefined;
  name: String;
  owner: String;
  comment: String;
  url: String;
  likes: [];
  comments: [];
}

type Sketches = Sketch[];

const SkechesPage = (props: Props) => {
  const [sketches, setSketches] = useState<Sketches>([]);

  const getSketches = async () => {
    try {
      const response = await fetch(
        `${serverURL}sketches/all`
      );
      const result = await response.json();
      setSketches(result);
      console.log("all users:", result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSketches();
  }, []);

  return (
    <div>
      <>
        <h1
          className="NavtrapBar"
          style={{ textAlign: "center", fontSize: "xxx-large" }}
        >
          Bocetos Subidos
        </h1>

        <div className="cardcontainer">
          {sketches &&
            sketches.map((sketch: Sketch) => {
              return <SketchCard key={sketch._id} props={sketch} />;
            })}
        </div>
      </>
    </div>
  );
};

export default SkechesPage;
