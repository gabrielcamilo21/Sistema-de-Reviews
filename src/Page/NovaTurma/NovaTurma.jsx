import { Form, FloatingLabel, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { addTurmas } from "../../firebase/turmas";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { validate } from "email-validator";

export function NovaTurma() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

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

    addTurmas(data)
      .then(() => {
        toast.success("Turma cadastrada com sucesso", {
          duration: 2000,
          position: "bottom-right",
        });
        navigate("/turmas");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data === "Todos os campos são obrigatórios"
        ) {
          toast.error("Todos os campos do formulário estão vazios.", {
            duration: 2000,
            position: "bottom-right",
          });
          console.error(error);
        } else {
          toast.error("Ocorreu um erro ao cadastrar a turma", {
            duration: 2000,
            position: "bottom-right",
          });
        }
      });
  }

  return (
    <Container className="backgroundCard">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Adicionar Turmas</h1>
      </div>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FloatingLabel
          controlId="nome"
          label="Nome da Turma"
          style={{ margin: "10px" }}
        >
          <Form.Control
            type="nome"
            placeholder="Nome"
            className={errors.nome && "is-invalid"}
            {...register("nome", { required: "O campo nome é obrigatório!" })}
          />
          {errors.nome && (
            <Form.Text className="invalid-feedback">
              {errors.nome.message}
            </Form.Text>
          )}
        </FloatingLabel>

        <FloatingLabel
          controlId="codigo"
          label="Código da Turma"
          style={{ margin: "10px" }}
        >
          <Form.Control
            type="text"
            placeholder="Digite o código da turma"
            className={errors.codigo && "is-invalid"}
            {...register("codigo", {
              required: "O campo código é obrigatório!",
            })}
          />
          {errors.codigo && (
            <Form.Text className="invalid-feedback">
              {errors.codigo.message}
            </Form.Text>
          )}
        </FloatingLabel>

        <FloatingLabel
          controlId="email"
          label="Lista de E-mails"
          style={{ margin: "10px" }}
        >
          <Form.Control
            as="textarea"
            placeholder="Digite a lista de e-mails separados por quebra de linha"
            className={errors.email && "is-invalid"}
            {...register("email", {
              required: "O campo lista de e-mails é obrigatório!",
            })}
          />
          {errors.email && (
            <Form.Text className="invalid-feedback">
              {errors.email.message}
            </Form.Text>
          )}
        </FloatingLabel>

        <FloatingLabel className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-warning"
            type="submit"
            style={{ margin: '10px' }}>
            Cadastrar
          </Button>
          <Button
            variant="outline-warning"
            as={Link} to={`/turmas`}
            style={{ margin: '10px' }}>
            Voltar
          </Button>
        </FloatingLabel>
      </Form>
    </Container>
  );
}
