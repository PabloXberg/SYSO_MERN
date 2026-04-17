import SubNav from "./SubNav";

const links = [
  { to: "/battle", label: "Bases", title: "Bases del concurso" },
  { to: "/actualbattle", label: "Actual", title: "Batalla Actual" },
  { to: "/battlehistory", label: "Anteriores", title: "Batallas anteriores", disabled: true },
];

function SubBattleNav() {
  return <SubNav links={links} />;
}

export default SubBattleNav;
