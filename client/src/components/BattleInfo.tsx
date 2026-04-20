import { useTranslation } from "react-i18next";
import SubBattleNav from "./SubBattleNav";

interface BattleInfoProps {
  /** If provided, shows a farewell line at the bottom (used by BattleHistory) */
  showFarewell?: boolean;
}

const BattleInfo = ({ showFarewell = false }: BattleInfoProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SubBattleNav />
      <div className="Battle-container">
        <div className="battleText">
          <h2 className="tituloFuente">{t("battle.rules")}</h2>
          <br />
          <h4>
            {t("battle.rulesDescription1")}
            <br />
            {t("battle.rulesDescription2")}
            <br />
            {t("battle.rulesDescription3")}
            <br /><br />
            {t("battle.rulesDescription4")}
          </h4>

          <br />

          <h2 className="tituloFuente">{t("battle.requirements")}</h2>
          <br />
          <h4>
            * {t("battle.requirement1")}<br />
            * {t("battle.requirement2")}<br />
            * {t("battle.requirement3")}
          </h4>

          <br /><br />
          <h4>
            {t("battle.farewell")}
            {showFarewell && (
              <>
                <br />
                {t("battle.seeYouSoon")}
              </>
            )}
          </h4>
        </div>
      </div>
    </>
  );
};

export default BattleInfo;
