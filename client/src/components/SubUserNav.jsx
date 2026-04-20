import { useTranslation } from "react-i18next";
import SubNav from "./SubNav";

function SubUserNav() {
  const { t } = useTranslation();

  const links = [
    { to: "/mysketchs", label: t("subNav.mySketches"), title: t("subNav.mySketchesTitle") },
    { to: "/myfav", label: t("subNav.favorites"), title: t("subNav.favoritesTitle") },
    { to: "/edit", label: t("subNav.edit"), title: t("subNav.editTitle") },
  ];

  return <SubNav links={links} />;
}

export default SubUserNav;
