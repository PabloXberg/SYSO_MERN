import { useTranslation } from "react-i18next";
import SubHomeNav from "../components/SubHomeNav";

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SubHomeNav />
      <div className="homeContainer">
        <div className="homeInfo">
          <h2 className="tituloFuente">{t("home.title")}</h2>
          <br />
          <h3>
            {t("home.paragraph1")}<br /><br />
            {t("home.paragraph2")}<br /><br />
            {t("home.paragraph3")}<br /><br />
            {t("home.paragraph4")}<br /><br />
            {t("home.paragraph5")}<br /><br />
            {t("home.paragraph6")}<br />
            {t("home.paragraph7")}
          </h3>
          <br /><br /><br /><br />
        </div>
      </div>
    </>
  );
};

export default Homepage;
