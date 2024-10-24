import Button from "react-bootstrap/Button";
import SketchCard from "./SketchCard";

function SketchModal(props) {
  if (!props.show) {
    return null;
  }



  return (
    <>
      <div
        style={{display:"flex", flexDirection:"column", alignItems:"center"}}
  
        onClick={props.onClose}>
        <div
          onClick={(e) => e.stopPropagation()}>
           <div className="modal-footer">
            <Button
              onClick={props.onClose}
              variant="danger"
              className="modal-close-btn"
              style={{justifySelf:"center", alignSelf:"center"}}
            >
              Close
            </Button>
          </div>
          {/* <div className="modal-header"> */}
          <div
            // className="cardcontainer"
            style={{display:"flex", flexDirection:"column"}}
          >
              {props.character.sketchs &&
                props.character.sketchs.map((sketch) => {
                  return (
                    <SketchCard
                      style={{ display: "flex", flexdirection: "column" }}
                      key={sketch._id}
                      props={sketch}
                    />
                  );
                })}
            </div>
          {/* </div> */}
          
         
        </div>
      </div>
    </>
  );
}

export default SketchModal;
