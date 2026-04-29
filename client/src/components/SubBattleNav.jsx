import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import SubNav from "./SubNav";

function SubBattleNav() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const links = [
    { to: "/battle", label: t("subNav.bases"), title: t("subNav.basesTitle") },
    { to: "/actualbattle", label: t("subNav.current"), title: t("subNav.currentTitle") },
    {
      to: "/battlehistory",
      label: t("subNav.previous"),
      title: t("subNav.previousTitle"),
    },
  ];

  // Admin link is only visible to admins. Server enforces the actual gate.
  if (user?.isAdmin) {
    links.push({
      to: "/admin/battles",
      label: t("subNav.adminBattles"),
      title: t("subNav.adminBattlesTitle"),
    });
  }

  return <SubNav links={links} />;
}

export default SubBattleNav;
