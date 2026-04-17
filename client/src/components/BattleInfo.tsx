import SubBattleNav from "./SubBattleNav";

interface BattleInfoProps {
  /** Text shown at the very bottom; slightly different between Battle and BattleHistory */
  farewell?: string;
}

/**
 * Shared content for the /battle and /battlehistory pages.
 * Before: battle.tsx and battlehistory.tsx were 99% identical.
 * Now: both pages render <BattleInfo /> with an optional farewell prop.
 */
const BattleInfo = ({ farewell }: BattleInfoProps) => {
  return (
    <>
      <SubBattleNav />
      <div className="Battle-container">
        <div className="battleText">
          <h2 className="tituloFuente">Bases del concurso:</h2>
          <br />
          <h4>
            A lo largo del año realizaremos varios "Sketchs Battles", donde
            cualquiera de nuestros seguidores desde cualquier parte del mundo
            podrá participar enviándonos su mejor boceto. <br />
            Los jueces elegidos para dicha batalla valorarán los bocetos
            recibidos y el ganador recibirá un maravilloso lote de premios.{" "}
            <br />
            Las reglas de las batallas variarán según las modalidades elegidas
            por los jueces.
            <br />
            <br />
            Tanto los jueces, como los premios, serán anunciados antes de cada
            batalla.
          </h4>

          <br />

          <h2 className="tituloFuente">Requisitos:</h2>
          <br />
          <h4>
            * Seguirnos en la página de Instagram. <br />
            * Realizar un Story de tu boceto, mencionándonos y escribiendo
            Sketch Battle.
            <br />
            * Registrarse en esta Web antes de la fecha indicada.
          </h4>

          <br />
          <br />
          <h4>
            No dudes en participar y estar atentos a nuestras publicaciones!
            {farewell && (
              <>
                <br />
                {farewell}
              </>
            )}
          </h4>
        </div>
      </div>
    </>
  );
};

export default BattleInfo;
