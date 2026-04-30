import "../../src/index.css";
// Updated poster: Share Your Style 4.0 (June 2026)
import cartel from "../images/share-your-style-4.jpeg";

const News = () => {
  return (
    <div className="news-container">
      <img
        className="sketchDetailsImg"
        src={cartel}
        alt="Share Your Style 4.0 — 6 y 7 de Junio"
      />
    </div>
  );
};

export default News;
