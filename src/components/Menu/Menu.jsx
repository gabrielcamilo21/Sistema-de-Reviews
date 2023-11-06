import { Container, Nav, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import logoIcon from "./../../assets/icons/livro.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { getUsuario } from "../../firebase/usuarios";
import { useForm } from "react-hook-form";
import semFotoPerfil from "../../assets/images/perfilSemFoto.png";
import { ImagemPerfil } from "../ImagemPerfil/ImagemPerfil";

export function Menu() {
  const navigate = useNavigate();
  const usuarioLogado = useContext(AuthContext);

  const { reset, setValue } = useForm();
  const [usuario, setUsuario] = useState(null);
  const [imagem, setImagem] = useState(null);

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
  
  function onLogout() {
    logout().then(() => {
      navigate("/login");
    });
  }

  return (
    <Navbar className="navbar" variant="dark" expand="lg" >
      <Container fluid>
        <Navbar.Brand>
          <Link to="/usuarios">
            <img src={logoIcon} width="60" alt="Logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {usuarioLogado.tipo === "Professor" &&<Nav.Link className="px-5" as={Link} to="/usuarios"> 
              Usuários
            </Nav.Link>}
            {usuarioLogado.tipo === "Professor" &&<Nav.Link className="px-5" as={Link} to="/turmas">
              Turmas
            </Nav.Link>}
            <Nav.Link className="px-5" as={Link} to="/perfil">
              Perfil
            </Nav.Link>
            {usuarioLogado.tipo === "Aluno" &&<Nav.Link className="px-5" as={Link} to="/reviewalunos">
              Reviews
            </Nav.Link>}
            {usuarioLogado.tipo === "Aluno" &&<Nav.Link className="px-5" as={Link} to="/feedbackdoaluno">
              Feedback
              </Nav.Link>}
            <Nav.Link className="px-5" as={Link} to="/perfil">
                <ImagemPerfil className="imagem-perfil" imagem={imagem} />
            </Nav.Link>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>Clique aqui para sair</Tooltip>}>
              <Nav.Link onClick={onLogout} className="px-5">
                <i className="bi bi-box-arrow-right"></i>
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
