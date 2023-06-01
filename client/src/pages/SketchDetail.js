import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Form } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const SketchDetail = () => {
  const { id } = useParams();
  const [sketch, setSketch] = useState();
  const [commentImput, setCommentInput] = useState("");

  const handleChange = (e) => {
    setCommentInput({ ...commentImput, [e.target.name]: e.target.value });
  };

  const geSketchbyID = async (ID) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const urlencoded = new URLSearchParams();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}sketches/id/${ID}`,
        requestOptions
      );
      const result = await response.json();
      console.log("single Sketch:", result);
      setSketch(result);
    } catch (error) {
      console.log(error);
    }
  };

  //   const commentSubmit = async() => {

  //    const myHeaders = new Headers();
  //    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  //    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  //   const urlencoded = new URLSearchParams();
  //   urlencoded.append("comment", "si si si si... antes de que preguneten, Pablo y yo compartíamos wohnung");
  //   urlencoded.append("owner", sketch.owner);
  //     urlencoded.append("sketch", sketch._id);

  //   const requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: urlencoded,
  // };

  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_BASE_URL}comments/new`, requestOptions);
  //       const result = await response.json();
  //       console.log(result);
  //       alert("Success!!! message saved");
  //       // setLoading(false);
  //     } catch (error) {
  //       console.log(error)
  //       alert("Something went wrong - message did't save")
  //       // setLoading(false);
  //     }

  //   }

  useEffect(() => {
    geSketchbyID(id);
  }, []);

  const datum = sketch?.createdAt;
  const shortdatum = datum?.substring(0, 10);
  console.log("sketch :>> ", sketch);
  // Contenido y lógica del componente


  return (
    <div className="sketchDetails">
      <div className="detailsImage">
        <Card className="bg-light ">
          <Card.Img variant="top" src={sketch?.url} alt={sketch?.name} />
          <Card.ImgOverlay style={{ border: "solid 2px white" }}>
            <h1 className="detailsTitle">{sketch?.name}</h1>
          </Card.ImgOverlay>
          <Card.Text className="detailsText1">{sketch?.comment}</Card.Text>
          <Card.Text className="detailsText2">Upload on {shortdatum}</Card.Text>

          

          <div style={{ height: "5rem", border: "solid 3px red" }}>
            {sketch?.comments ? (
              <h5 style={{ color: "black" }}>
                <b>{sketch?.comments?.owner?.username}</b>
                {sketch?.comments?.comment} PROBANDO
              </h5>
            ) : (
              "THERE ARE NO COMMENTS YET ABOUT THIS SKETCH"
            )}
          </div>

          <FloatingLabel controlId="floatingTextarea2" label="add a comment..">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "70px", width: "100%" }}
              name="comment"
              // onChange={handleChange}
            />
          </FloatingLabel>
        </Card>
      </div>

      {/* <div className="opciones">
         <Form onSubmit={(e) => {
          e.preventDefault();
          console.log(e.target)
        }}>
          <input type="text" placehodler={"add a comment..."}></input>
        </Form>

      </div> */}
    </div>
  );
};

export default SketchDetail;
