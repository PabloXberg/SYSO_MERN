import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React from 'react'

function SketchCard(props: any) {
   
    console.log('props SketchesCard:>> ', props);
    
    // const datum = props.createdAt;
    // const shortdatum = datum.substring(0, 10);
  
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