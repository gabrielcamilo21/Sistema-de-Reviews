
import { Outlet } from "react-router-dom";
import { Menu } from "../../components/Menu/Menu";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function Root() {
  const usuarioLogado = useContext(AuthContext);

  if (usuarioLogado === null) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <header>
        <Menu />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
