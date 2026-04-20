import { useTranslation } from "react-i18next";
import SubNav from "./SubNav";

function SubBattleNav() {
  const { t } = useTranslation();

  const links = [
    { to: "/battle", label: t("subNav.bases"), title: t("subNav.basesTitle") },
    { to: "/actualbattle", label: t("subNav.current"), title: t("subNav.currentTitle") },
    { to: "/battlehistory", label: t("subNav.previous"), title: t("subNav.previousTitle"), disabled: true },
  ];

  return <SubNav links={links} />;
}

export default SubBattleNav;
