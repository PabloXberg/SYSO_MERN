import SubNav from "./SubNav";

const links = [
  { to: "/mysketchs", label: "Mis Bocetos", title: "Bocetos subidos por mi" },
  { to: "/myfav", label: "Favoritos", title: "Mis bocetos favoritos" },
  { to: "/edit", label: "Editar", title: "Editar mi perfíl" },
];

function SubUserNav() {
  return <SubNav links={links} />;
}

export default SubUserNav;
