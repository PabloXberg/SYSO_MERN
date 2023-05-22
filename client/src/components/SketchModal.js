import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import SketchCard from './SketchCard';


function SketchModal(props) {
    if (!props.show) {
        return null
  }
//   console.log('props :>> ', props);
console.log('props in sketchmodal :>> ', props);

//   const datum = props.character.owner.createdAt;
//   const shortdatum = datum.substring(0, 10);

  return (
    <>
      
     <div className='modal-container' onClick={props.onClose} >
         <div className='modal-content'onClick={e => e.stopPropagation()} >
          <div className='modal-header'>
   
                    <div className='cardcontainer'>
                       {props.character.sketchs && props.character.sketchs.map((sketch) => {
                      return <SketchCard key={sketch._id} props={sketch} />
         })}
        </div>
                  </div>
           <div className='modal-footer'>
             <Button onClick={props.onClose} className='modal-close-btn'>Close</Button>
           </div>
         </div>   
       </div>
      </>
  )
}

export default SketchModal