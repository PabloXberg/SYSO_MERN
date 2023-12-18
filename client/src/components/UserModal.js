import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';

function UserModal(props) {
    if (!props.show) {
        return null
  }
  console.log('props :>> ', props);


  const datum = props.character.owner.createdAt;
  const shortdatum = datum.substring(0, 10);


  let longi 
  if (props.character.owner.sketchs !== undefined || props.character.owner.sketchs !== null || props.character.owner.sketchs !== 0) {
     longi = props.character.owner.sketchs.length;
  } else {
    longi = "0";
  }
  
  

  console.log('longi :>> ', longi);
  console.log('props  lalalala :>> ', props);
  return (
    <>
      
     <div className='modal-container' onClick={props.onClose} >
         <div className='modal-content'onClick={e => e.stopPropagation()} >
          <div className='modal-header'>
            <h3>{props.character.owner.username}</h3>
           </div>
          <div>
            < img className='modal-picture' src={props.character.owner.avatar} alt="User Avatar"/>
           </div>
           <div className='modal-body'>
            <h5>Personal Info: </h5><p><i>{props.character.owner.info}</i></p> 
         
            <h5>Uploaded Sketches: </h5> <p><i>{longi ? longi : props.characters.owner.sketchs.length}</i></p> 
            <h5>Registered on: </h5> <p><i>{shortdatum}</i></p>

           </div>
           <div className='modal-footer'>
             <Button onClick={props.onClose} className='modal-close-btn'>Close</Button>
           </div>
         </div>   
       </div>
      </>
  )
}

export default UserModal