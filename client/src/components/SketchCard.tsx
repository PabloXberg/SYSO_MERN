import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import UserModal from '../components/UserModal'

function SketchCard(props: any) {
const { user, login, logout } = useContext(AuthContext);
   const [show, setShow] = useState(false);
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
              <Card.Footer style={{cursor: "pointer"}} className="text-muted"><i>Created by: </i> <Card.Link onClick={()=>setShow(true)}><b>{props.props.owner.username ? props.props.owner.username : user?.username }</b></Card.Link></Card.Footer>
              {/* <Card.Footer className="text-muted"><i>Registered on: {shortdatum}</i></Card.Footer>     ME FALTA AGREGAR EL TIMESTAP CUANDO TENGA LA OPCION DE UPLOAD A NEW IMAGE*/} 
      </Card.Body>
      <UserModal style={{cursor: "pointer"}} onClose={()=> setShow(false)} show={show} character={props.props} />
    </Card>
  );
}

export default SketchCard;