import { useEffect } from "react";
import "../../src/index.css";
//import { InstagramEmbed } from "react-social-media-embed";
import SubBatlleNav from "../components/SubBattleNav";


const ActualBattle = () => {
  useEffect(() => {}, []);

  return (
    <>
      <SubBatlleNav />{" "}
      <div className="Battle-container">
        {/* WIDget para instagram */}
        {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

        <div className="battleText">
          <h2 className="tituloFuente">Share your Sketch Battle # 2</h2>
      
          <h5>
           
            
            <h3 className="tituloFuente">Reglas del concurso: </h3>
        
            * Palabra clave: "STYLE"
            <br />
             *  Subir boceto a la web, rellenando los campos nombre, <br />   descripcion ademas de escribir Sketch Battle # 1 en la ultima casilla
            <br />
            * Fecha limite: 3 de Junio 

            <br />
            * Formato: Papel DIN A4, horizontal y a color. Firmado como Sketch Battle # 2
 <br />
            * Fecha Ganador: 6 de Junio.<br />

            <h3 className="tituloFuente">Premios: </h3>
        
            *  Lamina DinA4 Share your Sketch.
 <br />
            * Estuche.<br />
            * Blackbook. <br />
            * Camiseta. <br />
            * 2 unidades aerosol MTN94. <br />
            * Pack Stickers. <br />
            * Entrada Share your Style # 4. <br /> 
          

                    <h3 className="tituloFuente">Jueces:
 </h3>  
Sig. Luigi -
SoldOne

          </h5>
        </div>
      </div>
    </>
  );
};

export default ActualBattle;
