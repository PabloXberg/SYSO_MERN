import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function UserCard(props: any) {

  const datum = props.props.createdAt;
  const shortdatum = datum.substring(0, 10);


  return (
  
    <div style={{display: "Flex", }}>
      
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={props.props.avatar} style={{borderRadius:"50%"}} />
      <Card.Body>
              <Card.Title>{props.props.username?props.props.username:"Nombre de Usuario"}</Card.Title>
        <Card.Text>
          {props.props.info ? props.props.info : "Hier we can see some info about the User"}
          </Card.Text>
          <Card.Link href="#"><i>Sketchs</i></Card.Link>
          <Card.Footer className="text-muted"><i>Registered on: {shortdatum}</i></Card.Footer>
        {/* <Button variant="primary">Details</Button> */}
      </Card.Body>
    </Card>
    
    </div>
      
    
  );
}

export default UserCard;