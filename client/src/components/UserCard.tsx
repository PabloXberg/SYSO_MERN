import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import SketchModal from '../components/SketchModal';
import { useState } from 'react';

function UserCard(props: any) {

  const datum = props.props.createdAt;
  const shortdatum = datum.substring(0, 10);
   const [show, setShow] = useState(false);

  return (
  
    <div style={{display: "Flex", }}>
      
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={props.props.avatar} style={{
          borderRadius: "50%", width: "15rem", height: "15rem", alignSelf: "center", padding:"1rem" }} />
        <Card.Body>
          


          <Card.Title>{props.props.username ? props.props.username : "Nombre de Usuario"}</Card.Title>
          
          {/* <Card.Link
              style={{ cursor: "pointer" }}
              onClick={() => setShow(true)}
            >
              <b>
                {props?.props.owner.username
                  ? props?.props.owner.username
                  : user?.username}
              </b>
            </Card.Link> */}




        <Card.Text>
          {props.props.info ? props.props.info : "Hier we can see some info about the User"}
          </Card.Text>
          <Card.Link style={{cursor: "pointer"}} onClick={()=>setShow(true)} ><i>Sketchs</i></Card.Link>
          <Card.Footer className="text-muted"><i>Registered on: {shortdatum}</i></Card.Footer>
        {/* <Button variant="primary">Details</Button> */}
      </Card.Body>
    </Card>
    <SketchModal style={{cursor: "pointer"}} onClose={()=> setShow(false)} show={show} character={props.props} />
    </div>
      
    
  );
}

export default UserCard;