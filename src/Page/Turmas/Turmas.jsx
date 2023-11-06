import { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { deleteTurma, getTurmas } from '../../firebase/turmas';

export function Turmas() {
  const [turmas, setTurmas] = useState(null);

  useEffect(() => {
    initializeTable();
  }, []);

  function initializeTable() {
    getTurmas().then((resultados) => {
      setTurmas(resultados);
    });
  }

  function onDeleteTurma(id) {
    const deletar = window.confirm(
      `Tem certeza que deseja excluir essa turma?`
    );
    if (deletar) {
      deleteTurma(id).then(() => {
        toast.success(` Turma apagada com sucesso!`, {
          duration: 2000,
          position: 'bottom-right',
        });
        initializeTable();
      });
    }
  }

  return (
    <Container className="backgroundCard">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Turmas</h1>
        <Button as={Link}
          to={`/novaturma`}
          variant="outline-warning"
          size="sm"
          className="me-2">Adicionar Turma</Button>
      </div>
      <hr />
      {turmas === null ? (
        <Loader />
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Turmas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((turma) => {
              return (
                <tr key={turma.nome}>
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm" className="me-2 ms-2 mx-2 my-2"
                      as={Link} to={`/alunos/${turma.codigo}`}>
                      {turma.nome}
                    </Button>
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/editarturma/${turma.id}`}
                      variant="outline-warning"
                      size="sm"
                      className="me-2 ms-2 mx-2 my-2"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => onDeleteTurma(turma.id, turma.nome)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
