import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { getUsuario, updateUsuario, uploadFotoUsuario } from "../../firebase/usuarios";
import { ImagemPerfil } from "../../components/ImagemPerfil/ImagemPerfil";
import semFotoPerfil from "../../assets/images/perfilSemFoto.png";

export function Perfil() {
  const usuarioLogado = useContext(AuthContext);
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
  const [usuario, setUsuario] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    if (usuarioLogado !== null) {
      getUsuario(usuarioLogado.uid).then((resultado) => {
        setUsuario(resultado);
        setValue("nome", resultado.nome);
        setValue("email", resultado.email);
        if (resultado.photoURL !== null) {
          setImagem(resultado.photoURL);
        } else {
          setImagem(semFotoPerfil);
        }
      });
    }
  }, [reset, usuarioLogado, setValue]);

  function onSubmit(data) {
    console.log(data);
    const img = data.imagem[0];
    if (img) {
      const toastId = toast.loading("Upload da imagem...", {
        position: "top-right",
      });
      setPhotoURL(data.photoURL);
      uploadFotoUsuario(img).then((url) => {
        toast.dismiss(toastId);
        data.photoURL = url;
        delete data.imagem;
        updateUsuario(usuarioLogado.uid, data).then(() => {
          toast.success("Perfil editado com sucesso!",
            { position: "bottom-right", duration: 2500 })
          setImagem(url);
        });
      });
    } else {
      delete data.imagem;
      updateUsuario(usuarioLogado.uid, data);
      toast.success("Perfil editado com sucesso!",
        { position: "bottom-right", duration: 2500 })
    }
  }

  return (
    <Container className="backgroundCard">
      <div className="d-flex justify-content-between align-items-center">
        <div style={{ width: "160px" }}>
          <ImagemPerfil imagem={imagem} />
        </div>
      </div>
      <hr />

      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group className="mb-3">
          <Form.Label>
            <span>Nome</span>
          </Form.Label>
          <Form.Control
            type="text"
            size="lg"
            className={errors.nome && "is-invalid"}
            {...register("nome", {
              required: "Nome é obrigatório!",
              maxLength: { value: 255, message: "Limite de 255 caracteres!" },
            })}
          />
          <Form.Text className="text-danger">{errors.nome?.message}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            <span>Email</span>
          </Form.Label>
          <Form.Control
            type="text"
            size="lg"
            className={errors.email && "is-invalid"}
            {...register("email", {
              required: "Email é obrigatório!",
              maxLength: { value: 255, message: "Limite de 255 caracteres!" },
            })}
          />
          <Form.Text className="text-danger">{errors.email?.message}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><span>Imagem de Perfil</span></Form.Label>
          <Form.Control type="file" {...register("imagem")} />
        </Form.Group>
        <Button
          variant="outline-warning"
          type="submit"
          style={{ margin: "10px" }}
        >
          Salvar
        </Button>
      </Form>
    </Container>
  );
}
