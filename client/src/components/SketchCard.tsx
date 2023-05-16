import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { Key, useEffect, useState } from 'react'

// type Props = {}

interface User {
  _id: Key | null | undefined
  email: String,
  username: String,
  password: String,
  info: String,
  sketchs: [],
  likes: [],
  comments:[]
}

interface Sketch {
  _id: Key | null | undefined
  name: String,
  owner: String,
  comment: String,
  url: String,
  likes: [],
  comments:[]
}


function SketchCard(props: any) {

    const [user, setUser] = useState<User | null>(null);
    const [sketch, setsketch] = useState<Sketch | null>(null);
    
    console.log('props SketchesCard:>> ', props);
    
    // const datum = props.createdAt;
    // const shortdatum = datum.substring(0, 10);
  
  
  //   const getUserById = async() => {
  //    const user_ID = props.props.owner
  //    try {
  //       const response = await fetch(`http://localhost:5000/api/users/id/${user_ID}`);
  //       const result = await response.json();
  //       console.log("single user:", result);
  //       setUser(result);
  //   } catch (error) {
  //       console.log(error)
  //   }
  // }


  useEffect(() => {
    // getUserById();
    }, [])

  return (
    <Card style={{ width: '18rem', height:'auto' }}>
      <Card.Img variant="top" alt ="Sketch" src={props.props.url} />
      <Card.Body>
              <Card.Title>{props.props.name}</Card.Title>
        <Card.Text>
          {props.props.comment ? props.props.comment : "Hier we can see some info about the Sketch"}
        </Card.Text>
        {/* <Button variant="primary">Details</Button> */}
              <Card.Footer className="text-muted"><i>Created by: </i> <Card.Link href="#"><b>{props.props.owner.username}</b></Card.Link></Card.Footer>
              {/* <Card.Footer className="text-muted"><i>Registered on: {shortdatum}</i></Card.Footer>     ME FALTA AGREGAR EL TIMESTAP CUANDO TENGA LA OPCION DE UPLOAD A NEW IMAGE*/} 
      </Card.Body>
    </Card>
  );
}

export default SketchCard;