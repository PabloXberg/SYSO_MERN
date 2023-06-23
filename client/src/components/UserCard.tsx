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
      
      <Card >
        <Card.Img variant="top" src={props.props.avatar} style={{
          borderRadius: "50%", width: "15rem", height: "15rem", alignSelf: "center", padding:"1rem" }} />
        <Card.Body style={{width: '18rem', display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <Card.Title>{props.props.username ? props.props.username : "Nombre de Usuario"}</Card.Title>

            <Card.Text>
              {props.props.info ? props.props.info : "Hier we can see some info about the User"}
            </Card.Text>
          <div>
            <Card.Footer style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <Card.Link style={{ cursor: "pointer" }} onClick={() => setShow(true)} ><i>Bocetos Subidos</i></Card.Link>
            </Card.Footer>  
            <Card.Footer className="text-muted"><i>Registrado el: {shortdatum}</i></Card.Footer>
          </div>
         
        {/* <Button variant="primary">Details</Button> */}
      </Card.Body>
    </Card>
    <SketchModal style={{cursor: "pointer"}} onClose={()=> setShow(false)} show={show} character={props.props} />
    </div>
      
    
  );
}

export default UserCard;