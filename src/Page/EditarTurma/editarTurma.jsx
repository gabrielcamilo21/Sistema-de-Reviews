import { Form, FloatingLabel, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { updateTurmas, getTurma } from "../../firebase/turmas";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { validate } from "email-validator";
import "../../index.css";

export function EditarTurma() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    getTurma(id).then((turma) => {
      setValue("nome", turma.nome);
      setValue("email", turma.email);
    });
  }, [id, setValue]);

  function onSubmit(data) {
    const emails = data.email.split("\n").map((e) => e.trim());
    const invalidEmails = emails.filter((email) => !validate(email));
    if (invalidEmails.length > 0) {
      toast.error(`O email ${invalidEmails[0]} é inválido`, {
        duration: 2000,
        position: "bottom-right",
      });
      return;
    }

    updateTurmas(id, data)
      .then(() => {
        toast.success("Turma editada com sucesso", {
          duration: 2000,
          position: "bottom-right",
        });
        navigate("/turmas");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Ocorreu um erro ao editar a turma", {
          duration: 2000,
          position: "bottom-right",
        });
      });
  }

  return (
    <Container className="backgroundCard">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Editar Turma</h1>
      </div>
      <hr />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FloatingLabel controlId="nome" label="Nome da Turma" style={{ margin: "10px" }}>
          <Form.Control
            type="nome"
            placeholder="Nome"
            className={errors.nome && "is-invalid"}
            {...register("nome", { required: "O campo nome é obrigatório!" })}
          />
          {errors.nome && (
            <Form.Text className="invalid-feedback">{errors.nome.message}</Form.Text>
          )}
        </FloatingLabel>

        <FloatingLabel controlId="email" label="Lista de E-mails" style={{ margin: "10px" }}>
          <Form.Control
            type="email"
            as="textarea"
            placeholder="Digite a lista de e-mails separados por quebra de linha"
            className={errors.email && "is-invalid"}
            {...register("email", { required: true })}
            isInvalid={!!errors.email}
          />
          {errors.email && (
            <Form.Text className="invalid-feedback">
              {errors.email.message}
            </Form.Text>
          )}
        </FloatingLabel>
        <FloatingLabel className="d-flex justify-content-between align-items-center">
          <Button variant="outline-warning" type="submit" style={{ margin: '10px' }}>
            Salvar
          </Button>
          <Button variant="outline-warning" as={Link} to={`/turmas`} style={{ margin: '10px' }}>
            Voltar
          </Button>
        </FloatingLabel>
      </Form>
    </Container>
  );
}
