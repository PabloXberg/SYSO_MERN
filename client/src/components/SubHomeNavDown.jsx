import { useTranslation } from "react-i18next";
import SubNav from "./SubNav";

function SubHomeNavDown() {
  const { t } = useTranslation();

  const links = [
    { to: "/supporters", label: t("subNav.supporters"), title: t("subNav.supportersTitle"), disabled: true },
    { to: "/contacto", label: t("subNav.contact"), title: t("subNav.contactTitle"), disabled: true },
    { to: "/shop", label: t("subNav.shop"), title: t("subNav.shopTitle"), disabled: true },
  ];

  return <SubNav links={links} />;
}

export default SubHomeNavDown;
