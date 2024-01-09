import React, { Key, useEffect, useState } from "react";
import "../../src/index.css";
import { InstagramEmbed } from "react-social-media-embed";

const Battle = () => {
  useEffect(() => {}, []);

  return (
    <>
      {" "}
      <div className="Battle-container">
        {/* WIDget para instagram */}
        {/* <div className="elfsight-app-26d13d88-234a-4eed-b7a3-a4622ef81e45"></div> */}

        <div className="battleText">
          <h2 style={{fontFamily: 'MiFuente'}}>Bases del concurso:</h2>
          <br />
          <h4>
            A lo largo del año realizaremos varios "Sketchs Battles", donde
            cualquiera de nuestros seguidores desde cualquier parte del mundo
            podra participar enviandonos su mejor boceto para hacerse con el
            lote de premios ofrecido para ese concurso. Los jueces variaran en
            cada una de las batallas, tambien algunas de sus reglas.
            <br />
            <br />
            <h2 style={{fontFamily: 'MiFuente'}}>Requisitos:</h2>
            <br />
            Seguirnos en la pagina de Instagram y registrase en esta Web. Subir
            el boceto a la Web antes de la fecha indicada , comentando Sketch
            Battle junto con la palabra elegida del mes a dibujar. Crear un
            Storie en Instagram mencionandonos. <br />
            <br />
            <h2 style={{fontFamily: 'MiFuente'}}>Premios: (se anunciaran pronto...)</h2>
            <br />
            No dudes en participar y estar atentos a nuestras publicaciones !!
            Hasta pronto Sketchers !!!
          </h4>
        </div>
      </div>
    </>
  );
};

export default Battle;
