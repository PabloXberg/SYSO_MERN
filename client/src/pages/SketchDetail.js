import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import { Button, Form, Modal } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { AuthContext } from '../contexts/AuthContext'
import FormControl from 'react-bootstrap/FormControl'
import '../index.css'


const SketchDetail = () => {
const { user } = useContext(AuthContext);
const { id } = useParams();
const [sketch, setSketch] = useState();
  const [commentImput, setCommentInput] = useState("");
  const [commentEditImput, setCommentEditInput] = useState("");
const [resultado, setResultado] = useState("");
const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseEdit = () => setShowEdit(false);
const handleShowEdit = () => setShowEdit(true);

  const handleChange = (e) => {

  setCommentInput( e.target.value );
}
  
const handleChangeEdit = (e) => {
    setCommentEditInput( e.target.value );
  }
  
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
      // console.log("single Sketch:", result);
      setSketch(result);
  } catch (error) {
   console.log(error)
   
  }
  }

  const commentSubmit = async() => {
    
   const myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
   myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    
  const urlencoded = new URLSearchParams();
  urlencoded.append("comment", commentImput);
  urlencoded.append("owner", user._id);
    urlencoded.append("sketch", sketch._id);
  // console.log('commentImput :>> ', commentImput);
    
  const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}comments/new`, requestOptions);
      setResultado (await response.json())
      console.log(resultado);
      setCommentInput("")
      // setLoading(false);
    } catch (error) {
      console.log(error)
      alert("Something went wrong - message did't save")
      // setLoading(false);
    }

  }
  

const commentDelete = async (comment) => {
  
  if (user._id === comment.owner._id) {
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
      
    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", comment._id);
    urlencoded.append("owner", comment.owner);
    urlencoded.append("sketch", sketch._id);

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}comments/delete/${comment._id}`, requestOptions)
      const result = await response.json();
          // console.log(result);
      setRefresh(true)
      handleCloseDelete();
    } catch (error) {
          console.log(error)
          alert("Algo salió Mal - Intentalo otra vez...")
    }


  }
}

  const handleCommentEdit = async (comment) => {
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    
const urlencoded = new URLSearchParams();
urlencoded.append("comment", commentEditImput);
urlencoded.append("_id", comment._id);
urlencoded.append("owner", comment.owner);
urlencoded.append("sketch", sketch._id);
    

    
const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
};

        try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}comments/update/${comment._id}`, requestOptions)
      const result = await response.json();
          console.log(result);
          setRefresh(true)
          handleCloseEdit();
    } catch (error) {
          console.log(error)
          alert("Algo salió Mal - Intentalo otra vez...")
    }

}
  
  

useEffect(() => {
  geSketchbyID(id)
  setRefresh(false)
  }, [resultado, refresh, id]);

  const datum = sketch?.createdAt;
  const shortdatum = datum?.substring(0, 10);


  // console.log('sketch :>> ', sketch);
  // Contenido y lógica del componente
  return (
     <div className="sketchDetails">

       <div className='detailsImage'>
           <Card className="bg-light ">
          <Card.Img variant="top" src={sketch?.url} alt={sketch?.name} />

          <span style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <h1  >{sketch?.name}</h1>
            <Card.Text ><i>Upload on {shortdatum}</i></Card.Text>
           <Card.Text ><i>Upload by <b>{sketch?.owner?.username}</b></i></Card.Text>
          </span>  
                    
 <div style={{ display: "flex",flexDirection:"row" ,justifyContent: "space-between" }}>
          <Card.Text  className='detailsText1'>{sketch?.comment}</Card.Text>
           
              
              {sketch?.likes && (<h5>{sketch?.likes?.length}{" "}{(<i className="material-icons">thumb_up</i>)}</h5>)}


      {/* PARA HACER LA FUNCIONALIDAD DEL LIKES/UNLIKES       */}
              {/* {sketch?.likes?.includes(user?._id) 
              

                ?
                    // ME GUSTA Y NO ME  GUSTA
                (<div style={{display: "flex", flexDirection: "row", justifyContent:"flex-start", gap:"5px"}}> <i className="material-icons Bedit" style={{ cursor: "pointer" }} onClick={() => unlikeSketch(sketch?._id)}>thumb_down</i>
                   {sketch?.likes && (<h6>{sketch?.likes?.length}{" "}{sketch?.likes?.length === 1 ? <i></i> : <i></i> }</h6>)} </div>
                 )
                
                :
                (
                  <div style={{display: "flex", flexDirection: "row", justifyContent:"flex-start"}}> <i className="material-icons Bedit" style={{ cursor: "pointer" }} onClick={() => likeSketch(sketch?._id)}>thumb_up</i>  
                   {sketch?.likes && (<h6>{sketch?.likes?.length}{" "}{sketch?.likes?.length === 1 ? <i></i> : <i></i> }</h6>)} </div>             )
              } */}







            </div>
              <FloatingLabel controlId="floatingTextarea2" label="add a comment..">
                 <Form.Control
                                  as="textarea"
                                  style={{ height: '70px', width: "100%" }}
                                  name="comment"
                                  onChange={handleChange}
                                  value={commentImput}
                                  onSubmit={() => commentSubmit}
                                  onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    commentSubmit()
                                  }
                                }}
                                />
            {/* <div style={{display:"flex", flexDirection: "row",alignItems:"flex-end", marginRight:"0px", marginLeft:"930px"}}> <Button style={{dfisplay:"flex", flexDirection: "row",alignItems:"flex-end"}} onClick={commentSubmit} variant='success'>enviar</Button></div> */}
           
                   </FloatingLabel>
        </Card>
          
          <div>
           
            {sketch?.comments?.length >= 0
              
              ?
            <>
              
              {sketch.comments && sketch.comments.map((comment, index) => {

                let TextDatum =""
                if (comment.createdAt === comment.updatedAt) {
                const commentdatum = comment.createdAt;
                  const commentshortdatum = commentdatum.substring(0, 10);
                  TextDatum = "dijo el " + commentshortdatum;
                } else{
                   const commentdatum = comment.updatedAt;
                  const commentshortdatum = commentdatum.substring(0, 10);
                   TextDatum = "editado el " + commentshortdatum;
              }
          

                return (

                
              
                  <div style={{ padding: "3px" }}>
                    <div className='commentFlex'>
                        <div key={comment._id} >
                      
                    {/* {console.log('comment :>> ', comment)} */}
                      <div className='commentOwner'> <p style={{ color: "black" }}><b>{comment?.owner?.username}</b> <i> {TextDatum}</i></p>   
                             {comment?.owner._id === user?._id
                        ? 
                            <div className='commentIcons'>
                              <i className="large material-icons Bedit" onClick={handleShowEdit} style={{ cursor: "pointer" }} >edit</i>
                              <i className="large material-icons Bedit" onClick={handleShowDelete} style={{ cursor: "pointer" }} >delete_forever</i>
                            </div> 
                        
                        :
                            ""
                      }
                        </div>
                    </div>
                      <div className="commentText"><p><i>{comment.comment}</i></p></div>
                      
                    
                    </div>

                    <Modal style={{height:"20rem"}} show={showDelete} onHide={handleCloseDelete}>
                            <Modal.Header closeButton>
                              <Modal.Title>ATENCION</Modal.Title>
                            </Modal.Header>
                      <Modal.Body>   <Modal.Header>
                              <Modal.Title>Estas seguro de borrar el comentario???</Modal.Title>
                            </Modal.Header> <br></br>
                        <div style={{display:"flex", flexDirection:"row", justifyContent: "space-around"}}> <Button variant="success" onClick={handleCloseDelete}>
                                Cancelar
                              </Button>
                              <Button onClick={()=>commentDelete(comment, index)} variant="danger">
                                Eliminar
                              </Button></div>   
                       
                      </Modal.Body>
       
                    </Modal>


                       <Modal style={{height:"23rem"}} show={showEdit} onHide={handleCloseEdit}>
                            <Modal.Header closeButton>
                              <Modal.Title>Editar Comentario</Modal.Title>
                            </Modal.Header>
                          <Modal.Body> <Modal.Title>Estás seguro de eliminar el comentario??</Modal.Title>     <br/>
                        <Form.Control style={{height:"5rem"}} type="text" name='comment' placeholder={comment?.comment} onChange={handleChangeEdit} />
                        <br/>
                        < div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                          <Button variant="danger" onClick={ handleCloseEdit}>
                                Cancelar
                              </Button>
                              <Button  onClick={()=>handleCommentEdit(comment)} variant="success">
                                Guardar
                              </Button></div>
                           
                        </Modal.Body>
                            
                    </Modal>
                  
                  
                  </div>
             
               
    );
              })}
              


   






              </>
             
            :
            ""}
          </div>


              
        


        
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