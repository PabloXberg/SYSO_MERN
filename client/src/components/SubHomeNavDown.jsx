import SubNav from "./SubNav";

const links = [
  { to: "/supporters", label: "Supporters", title: "Colaboradores", disabled: true },
  { to: "/contacto", label: "Contacto", title: "Vías de comunicación", disabled: true },
  { to: "/shop", label: "Shop", title: "Tienda online", disabled: true },
];

function SubHomeNavDown() {
  return <SubNav links={links} />;
}

export default SubHomeNavDown;
