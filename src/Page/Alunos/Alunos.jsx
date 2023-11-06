import { useEffect, useState } from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Loader } from '../../components/Loader/Loader';
import { getAlunosDaTurma } from '../../firebase/turmas';
import { Link, useParams } from 'react-router-dom';
import { getReviews } from '../../firebase/reviews';
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { useForm } from 'react-hook-form';
import semFotoPerfil from "../../assets/images/perfilSemFoto.png"

export function Alunos() {
  const [alunos, setAlunos] = useState(null);
  const { idTurma } = useParams();
  const usuarioLogado = useContext(AuthContext);
  const { handleSubmit} = useForm();

  useEffect(() => {
    initializeTable();
}, []);

  async function initializeTable() {
  const reviews = await getReviews(usuarioLogado.uid);
  }

  useEffect(() => {
    getAlunosDaTurma(idTurma)
      .then((resultado) => setAlunos(resultado))
      .catch((error) => {
        toast.error('Erro ao obter os alunos da turma');
        console.error(error);
      });
  }, []);
  const onSubmit = (data) => {
    data.idAluno = usuarioLogado.uid
    initializeTable();
};

  return (
    <Container className="backgroundCardTurma">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Alunos da Turma:</h1>
      </div>
      <hr />
      <Form onSubmit={handleSubmit(onSubmit)}>
      {alunos === null ? (
        <Loader />
      ) : (
      <div className="card-container row">
        {alunos.map((aluno) => (
          <Card key={aluno.id} className="cards no-border" style={{ maxWidth: '200px' }}>
            <Card.Body
              as={Link}
              to={`/reviewprofessor/${aluno.id}`}
              className="card-img-top">
              <img
                className="rounded-circle img-fluid"
                src={aluno.photoURL ? aluno.photoURL : semFotoPerfil}
                alt="Foto do Aluno"
              />
              <Card.Title className="custom-title">{aluno.nome}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
      )}
       </Form >
    </Container>
  );
}