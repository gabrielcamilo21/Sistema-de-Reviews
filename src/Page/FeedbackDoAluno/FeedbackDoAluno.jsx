import { Form, FloatingLabel, Button, Container, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  addFeedbacks,
  deleteFeedbacks,
  getFeedbacks,
} from "../../firebase/feedbackDoProfessor";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export function FeedbackDoAluno() {
  const usuarioLogado = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    initializeTable();
  }, []);

  async function initializeTable() {
    const feedbacks = await getFeedbacks(usuarioLogado.uid);
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
    data.alunoId = usuarioLogado.uid;
    data.autor = usuarioLogado.nome;
    data.tipoAutor = usuarioLogado.tipo;

    addFeedbacks(data).then(() => {
      toast.success("Feedback cadastrado com sucesso", {
        duration: 2000,
        position: "bottom-right",
      });
      initializeTable(usuarioLogado.uid);
      reset();
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
      <div className="d-flex justify-content-between align-items-center">
        <h1>Feedback do Aluno</h1>
      </div>
      <hr />
      <div className="chatProfDiv">
        <span className="chatProf">Responder ao Professor:</span>
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
            to={`/feedbackdoprofessor/${usuarioLogado.uid}`}
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
              .filter((feedback) => feedback.alunoId === usuarioLogado.uid)
              .map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.autor}</td>
                  <td>{feedback.dataEnvio}</td>
                  <td>{feedback.texto}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      hidden={feedback.tipoAutor === "Professor"}
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
