import "../index.css";
import SketchCard from "../components/SketchCard";
import SubHomeNav from "../components/SubHomeNav";
import { serverURL } from "../serverURL";
import { useFetch } from "../hooks/useFetch";
import { Sketch } from "../@types/models";

const SketchesPage = () => {
  const { data: sketches, refetch } = useFetch<Sketch[]>(
    `${serverURL}sketches/all`,
    (raw) => raw.reverse()
  );

  return (
    <div>
      <SubHomeNav />
      <div className="cardcontainer">
        {sketches?.map((sketch) => (
          <SketchCard key={sketch._id} props={sketch} onUpdate={refetch} />
        ))}
      </div>
    </div>
  );
};

export default SketchesPage;
