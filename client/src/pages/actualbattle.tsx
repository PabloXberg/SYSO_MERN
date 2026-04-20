import { useTranslation } from "react-i18next";
import SubBattleNav from "../components/SubBattleNav";

const ActualBattle = () => {
  const { t } = useTranslation();

  return (
    <>
      <SubBattleNav />
      <div className="Battle-container">
        <div className="battleText">
          <h2 className="tituloFuente">{t("battle.currentBattleTitle")}</h2>

          <h5>
            <h3 className="tituloFuente">{t("battle.rules")}</h3>

            * {t("battle.keyword")}: "STYLE"
            <br />
            * {t("battle.uploadInstructions")}
            <br />
            * {t("battle.deadline")}: 3 de Junio / June 3rd
            <br />
            * {t("battle.format")}: {t("battle.formatDescription")}
            <br />
            * {t("battle.winnerDate")}: 6 de Junio / June 6th
            <br />

            <h3 className="tituloFuente">{t("battle.prizes")}:</h3>

            * Lamina DinA4 Share your Sketch.<br />
            * Estuche.<br />
            * Blackbook.<br />
            * Camiseta / T-shirt.<br />
            * 2 unidades aerosol MTN94.<br />
            * Pack Stickers.<br />
            * Entrada Share your Style # 4.<br />

            <h3 className="tituloFuente">{t("battle.judges")}:</h3>
            Sig. Luigi - SoldOne
          </h5>
        </div>
      </div>
    </>
  );
};

export default ActualBattle;
