import  { useEffect } from "react";
import "../../src/index.css";
//import { InstagramEmbed } from "react-social-media-embed";
import SubBatlleNav from "../components/SubBattleNav";
import SubHomeNavDown from "../components/SubHomeNavDown";

const BattleHistory = () => {
  useEffect(() => {}, []);

  return (
    <>
      <SubBatlleNav />
      {" "}
      <div className="Battle-container">
        {/* WIDget para instagram */}
        {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

        <div className="battleText">
          
          <h2 className="tituloFuente">Bases del concurso:</h2>
          <br />
          <h4>
            A lo largo del año realizaremos varios "Sketchs Battles", donde
            cualquiera de nuestros seguidores desde cualquier parte del mundo
            podra participar enviandonos su mejor boceto. <br />
            Los jueces elegidos para dicha batalla valoraran los bocetos recibidos
            y el ganador recibira un maravilloso lote de premios. <br />

            Las reglas de las batallas variaran segun las modalidades elegidas por los jueces. <br /><br />
            Tanto los jueces, como los premios, seran anunciados antes de cada batalla.

            <br />
            <br />
            <h2 className="tituloFuente">Requisitos:</h2>
            <br />
          * Seguirnos en la pagina de Instagram. <br />
          * Realizar un Storie de tu boceto, mencionandonos y escribiendo Sketch Battle.<br />
          * Registrarse en esta Web antes de la fecha indicada. <br />
            <br />
            <br />
            No dudes en participar y estar atentos a nuestras publicaciones !!
            Hasta pronto Sketchers !!!
          </h4>
        </div>
      </div>
       
    </>
  );
};

export default BattleHistory;
