import { Form, FloatingLabel, Button, Container, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  addFeedbacks,
  deleteFeedbacks,
  getFeedbacks,
} from "../../firebase/feedbackDoProfessor";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUsuario } from "../../firebase/usuarios";

export function FeedbackDoProfessor() {
  const usuarioLogado = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const [dadoAluno, setDadoAluno] = useState({});

  useEffect(() => {
    initializeTable();
    getUsuario(id).then(setDadoAluno);
  }, []);

  async function initializeTable() {
    const feedbacks = await getFeedbacks(id);
    setFeedbacks(feedbacks);
    const formattedFeedbacks = feedbacks.map((feedback) => {
      const dataEnvio = new Date(feedback.dataEnvio.seconds * 1000);
      const dataFormatada = dataEnvio.toLocaleString();
      return { ...feedback, dataEnvio: dataFormatada };
    });
    formattedFeedbacks.sort(
      (a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio)
    );
    setFeedbacks(formattedFeedbacks);
  }

  const onSubmit = (data) => {
    data.dataEnvio = new Date();
    data.alunoId = id;
    data.autor = usuarioLogado.nome;
    data.tipoAutor = usuarioLogado.tipo;
    addFeedbacks(data).then(() => {
      toast.success("Feedback cadastrado com sucesso", {
        duration: 2000,
        position: "bottom-right",
      });
      navigate(`/feedbackdoprofessor/${id}`);
      reset();
      initializeTable(id);
    });
  };

  function onDeleteFeedbacks(id) {
    const deletar = window.confirm(
      `Tem certeza que deseja excluir esse feedback?`
    );
    if (deletar) {
      deleteFeedbacks(id).then(() => {
        toast.success(` Feedback apagado com sucesso!`, {
          duration: 2000,
          position: "bottom-right",
        });
        initializeTable();
      });
    }
  }

  return (
    <Container className="backgroundCard">
      <div className="d-flex justify-content-start align-items-center">
        <img
          className="fotoFeed m-2 rounded-circle shadow p-0 img-thumbnail img-fluid"
          src={dadoAluno.photoURL}
        />
        <h1 className="m-2">
          Feedback: {dadoAluno.nome} - {dadoAluno.idTurma}
        </h1>
      </div>
      <hr />
      <div className="chatProfDiv">
        <span className="chatProf">Escrever:</span>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FloatingLabel controlId="" label="" style={{ margin: "10px" }}>
          <Form.Control
            type="text"
            as="textarea"
            className={`textarea2 ${errors.feedProf && "is-invalid"}`}
            {...register("texto", {
              required: "O campo lista de e-mails é obrigatório!",
            })}
          />
          {errors.feedProf && (
            <Form.Text className="invalid-feedback">
              {errors.feedProf.message}
            </Form.Text>
          )}
        </FloatingLabel>
        <FloatingLabel className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-warning"
            type="submit"
            style={{ margin: "10px" }}
          >
            Enviar
          </Button>
          <Button
            variant="outline-warning"
            as={Link}
            to={`/reviewprofessor/${id}`}
            style={{ margin: "10px" }}
          >
            Voltar
          </Button>
        </FloatingLabel>
      </Form>
      <Table responsive>
        <thead>
          <tr>
            <th>Autor</th>
            <th>Data</th>
            <th>Feedback</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks &&
            feedbacks
              .filter((feedback) => feedback.alunoId === id)
              .map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.autor}</td>
                  <td>{feedback.dataEnvio}</td>
                  <td>{feedback.texto}</td>
                  <td>
                    <Button
                      as={Link}
                      hidden={feedback.tipoAutor === "Aluno"}
                      to={`/editarfeedbackdoprofessor/${feedback.id}`}
                      variant="outline-warning"
                      size="sm"
                      className="me-2 ms-2 mx-2 my-2"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button
                      size="sm"
                      className="me-2 ms-2 mx-2 my-2"
                      variant="outline-warning"
                      hidden={feedback.tipoAutor === "Aluno"}
                      onClick={() =>
                        onDeleteFeedbacks(feedback.id, feedback.texto)
                      }
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </Container>
  );
}
