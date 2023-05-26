import React from 'react';
import { useParams } from "react-router-dom";


const SketchDetail = () => {

  const { id } = useParams();
  console.log('id :>> ', id);
  // Contenido y lógica del componente
  return (
    
    <div>
      Contenido del componente SketchDetail

    </div>
  )
};

export default SketchDetail;