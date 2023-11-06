import { useContext, useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import { getUsuarios } from "../../firebase/usuarios";
import { AuthContext, isLogado } from "../../contexts/AuthContext";

export function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState(null);
  const usuarioLogado = useContext(AuthContext);

  useEffect(() => {
    initializeTable();
    if (!isLogado(usuarioLogado)) navigate("/login");
  }, []);

  function initializeTable() {
    getUsuarios().then((resultados) => {
      resultados.sort((a, b) => {
        if (a.tipo === "Professor" && b.tipo !== "Professor") {
          return -1;
        } else {
          return 0;
        }
      });

      setUsuarios(resultados);
    });
  }

  return (
    <Container className="backgroundCard">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Usuários</h1>
      </div>
      <hr />
      {usuarios === null ? (
        <Loader />
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              return (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.tipo}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
