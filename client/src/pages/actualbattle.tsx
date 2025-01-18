import { useEffect } from "react";
import "../../src/index.css";
//import { InstagramEmbed } from "react-social-media-embed";
import SubBatlleNav from "../components/SubBattleNav";
import SubHomeNavDown from "../components/SubHomeNavDown";

const ActualBattle = () => {
  useEffect(() => {}, []);

  return (
    <>
      <SubBatlleNav />{" "}
      <div className="Battle-container">
        {/* WIDget para instagram */}
        {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

        <div className="battleText">
          <h2 className="tituloFuente">Share your Sketch Battle # 1</h2>
      
          <h5>
            Os damos la bienvenida a esta primera batalla de bocetos, donde todo
            participante es mas que bien bienvenido!
            <br />
                      Para nosotros es un verdadero placer que a partir de ahora,
            cualquiera de nuestros seguidores ya podra <br />
            interactuar con nuestro
            colectivo participando en este evento desde cualquier parte del
            mundo y a traves de esta pagina web.
            <br /><br />
            Las reglas, formatos, jueces y premios iran variando a lo largo de
            dichas batallas, las cuales se realizaran cada 3 meses.
            <br />
           
            Tanto los jueces, como los premios, seran anunciados antes de cada
            batalla.
            <br />
            
            <h3 className="tituloFuente">Reglas del concurso: </h3>
        
            * Palabra clave "SHARE", o elegir batalla #1 al subir el boceto.
            <br />
            * A realizar en  DinA4 en horizontal y a color. Firmado como Sketch Battle #1.
            importar los materiales utilizados.
            <br />
            * Registrarse en esta Web antes de la fecha indicada. <br />
            * Fecha limite: 1 de febrero. El ganador se anunciara el 6 de Febrero.<br />

            <h3 className="tituloFuente">Premios: </h3>
        
            *  Lámina DinA4 Share your Sketch.
 <br />
            * Estuche.<br />
            * Blackbook. <br />
            * Camiseta. <br />
            * 2 unidades aerosol MTN94. <br />
            * Pack Stickers. <br />
            * Entrada Share your Style # 4. <br /> 
          
            <h3 className="tituloFuente">Requisitos:
 </h3>
          
            Registrarse en esta pagina ademas de seguirnos en Instagram, subir
            el boceto con la descripcion Sketch Battle #1 antes del día 1 de Febrero <br />
            tambien subir en Stories de Instagram añadiendo el enlace de esta
            pagina con el titular ‘Sketch Battle #1’
                      <br />
                    <h3 className="tituloFuente">Jueces:
 </h3>  
AliciaNuro - 
Sig. Luigi - 
SoldOne

          </h5>
        </div>
      </div>
    </>
  );
};

export default ActualBattle;
