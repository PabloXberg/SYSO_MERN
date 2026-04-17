import SubNav from "./SubNav";

const links = [
  { to: "/sketches", label: "Bocetos", title: "Bocetos subidos" },
  { to: "/users", label: "Usuarios", title: "Usuarios Registrados" },
];

function SubHomeNav() {
  return <SubNav links={links} />;
}

export default SubHomeNav;
