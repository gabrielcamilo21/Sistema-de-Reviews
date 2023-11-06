import { Form, FloatingLabel, Button, Container, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { updateFeedbacks, getFeedbacksId } from "../../firebase/feedbackDoProfessor";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export function EditarFeedbackDoProfessor() {
  const usuarioLogado = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    getFeedbacksId(id).then((feedbacks) => {
      setValue("texto", feedbacks.texto);
    });
  }, [id, setValue]);

  function onSubmit(data) {
    // data.autor = usuarioLogado.nome;
    // data.tipoAutor = usuarioLogado.tipo;

    updateFeedbacks(id, data).then(() => {
      toast.success("Feedback alterado com sucesso", { duration: 2000, position: "bottom-right" });
      navigate(-1);
    });
  };

  return (

    <Container className="backgroundCard">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Editar Feedback</h1>
      </div>
      <hr />
      <div className="chatProfDiv">
        <span className="chatProf">Professor</span>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FloatingLabel
          controlId="texto"
          label=""
          style={{ margin: "10px" }}
        >
          <Form.Control
            type="text"
            as="textarea"
            className={`textarea2 ${errors.texto && "is-invalid"}`}
            {...register("texto", {
              required: "O campo de feedaback é obrigatório!",
            })}
          />
          {errors.texto && (
            <Form.Text className="invalid-feedback">
              {errors.texto.message}
            </Form.Text>
          )}
        </FloatingLabel>
        <FloatingLabel className="d-flex justify-content-between align-items-center">
          <Button variant="outline-warning" type="submit" style={{ margin: '10px' }}>
            Salvar
          </Button>
          <Button
            as={Link} to={-1}
            variant="outline-warning"
            style={{ margin: '10px' }}>
            Voltar
          </Button>
        </FloatingLabel>
      </Form>
    </Container>
  );
}
