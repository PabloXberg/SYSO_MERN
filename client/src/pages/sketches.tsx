// import "../index.css";
import SketchCard from "../components/SketchCard";
import SubHomeNav from "../components/SubHomeNav";
import { serverURL } from "../serverURL";
import { useFetch } from "../hooks/useFetch";
import { Sketch } from "../@types/models";

const SketchesPage = () => {
  // Handles both response formats for backwards-compat:
  //   - Old backend: returns an array directly
  //   - New backend (paginated): returns { sketches: [...], pagination: {...} }
  const { data, refetch } = useFetch<Sketch[]>(
    `${serverURL}sketches/all`,
    (raw: any) => {
      if (Array.isArray(raw)) {
        // Old backend — reverse to show newest first
        return [...raw].reverse();
      }
      // New backend already sorts by createdAt DESC
      return raw?.sketches || [];
    }
  );

  return (
    <div>
      <SubHomeNav />
      <div className="cardcontainer">
        {data?.map((sketch) => (
          <SketchCard key={sketch._id} props={sketch} onUpdate={refetch} />
        ))}
      </div>
    </div>
  );
};

export default SketchesPage;
