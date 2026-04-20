import { useTranslation } from "react-i18next";
import SubNav from "./SubNav";

function SubHomeNav() {
  const { t } = useTranslation();

  const links = [
    { to: "/sketches", label: t("subNav.sketches"), title: t("subNav.sketchesTitle") },
    { to: "/users", label: t("subNav.users"), title: t("subNav.usersTitle") },
  ];

  return <SubNav links={links} />;
}

export default SubHomeNav;
