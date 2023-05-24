import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import UserModal from '../components/UserModal'

// import UserModel from "../../../server/models/userModels.js";

function SketchCard(props: any) {
const { user, login, logout } = useContext(AuthContext);
   const [show, setShow] = useState(false);

    
 
  return (
    <Card style={{ width: '18rem', height:'auto' }}>
      <Card.Img variant="top" alt ="Sketch" src={props.props.url} />
      <Card.Body>
              <Card.Title>{props.props.name}</Card.Title>
        <Card.Text>
          {props.props.comment ? props.props.comment : "Hier we can see some info about the Sketch"}
        </Card.Text>
        
   
        {/* <Button variant="primary">Details</Button> */}
        {props.props.owner.username ? <Card.Footer className="text-muted"> <i>Created by: </i> <Card.Link style={{ cursor: "pointer" }} onClick={() => setShow(true)}><b>{props?.props.owner.username ? props?.props.owner.username : user?.username}</b></Card.Link></Card.Footer> : <Card.Footer><i className="material-icons" style={{cursor: "pointer"}}>delete_forever</i></Card.Footer>}
              {/* <Card.Footer className="text-muted"><i>Registered on: {shortdatum}</i></Card.Footer>     ME FALTA AGREGAR EL TIMESTAP CUANDO TENGA LA OPCION DE UPLOAD A NEW IMAGE*/} 
        <Card.Footer>
          
          <i className="material-icons" style={{cursor: "pointer"}}>thumb_up</i>
          <i className="material-icons" style={{cursor: "pointer"}}>thumb_down</i>
         
            <i className="material-icons" style={{cursor: "pointer"}}>message</i>
       </Card.Footer>
      </Card.Body>
      <UserModal style={{cursor: "pointer"}} onClose={()=> setShow(false)} show={show} character={props.props} />
    </Card>
  );
}

export default SketchCard;

function done(arg0: null, arg1: boolean) {
  throw new Error('Function not implemented.');
}
