import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';


const SketchDetail = () => {
const { id } = useParams();
const [sketch, setSketch] = useState();


const geSketchbyID = async (ID) => {

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

const urlencoded = new URLSearchParams();

const requestOptions = {
  method: 'GET',
  headers: myHeaders,

  };
  
 try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}sketches/id/${ID}`, requestOptions)
      const result = await response.json();
      console.log("single Sketch:", result);
      setSketch(result);
  } catch (error) {
   console.log(error)
   
  }
  }
  
useEffect(() => {
    geSketchbyID(id)
  }, []);
  


  // Contenido y lógica del componente
   return (
    <Card className="bg-dark text-white">
      <Card.Img src={sketch?.url} alt={sketch?.name} />
      <Card.ImgOverlay>
        <Card.Title>{sketch?.name}</Card.Title>
        <Card.Text>
         {sketch?.comment}
        </Card.Text>
        <Card.Text>Last updated 3 mins ago</Card.Text>
      </Card.ImgOverlay>
    </Card>
  );
};

export default SketchDetail;