import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Root } from "./Page/Root/Root";
import { Usuarios } from "./Page/Usuarios/Usuarios";
import { Login } from "./Page/Login/Login";
import { AuthContext } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase/config";
import { Turmas } from "./Page/Turmas/Turmas";
import { NovaTurma } from "./Page/NovaTurma/NovaTurma";
import { Cadastro } from "./Page/Cadastro/Cadastro";
import { Toaster } from "react-hot-toast";
import { EditarTurma } from "./Page/EditarTurma/editarTurma";
import { Perfil } from "./Page/Perfil/Perfil";
import { ReviewAlunos } from "./Page/ReviewAlunos/ReviewAlunos";
import { Alunos } from "./Page/Alunos/Alunos";
import { getUsuario } from "./firebase/usuarios";
import { Navigate } from "react-router-dom";
import { ReviewProfessor } from './Page/ReviewProfessor/ReviewProfessor';
import { FeedbackDoProfessor } from "./Page/FeedbackDoProfessor/FeedbackDoProfessor";
import { EditarFeedbackDoProfessor } from "./Page/EditarFeedbackDoProfessor/EditarFeedbackDoProfessor";
import { FeedbackDoAluno } from "./Page/FeedbackDoAluno/FeedbackDoAluno";

export function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUsuario(user.uid).then((resultado) => {
          user.tipo = resultado.tipo
          user.nome = resultado.nome
          setUsuarioLogado(user);
          setLoading(false);
        });
      } else{
        setLoading(false);

      }
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <AuthContext.Provider value={usuarioLogado}>
        <BrowserRouter>
          <Routes>
            {/* Rota do profesor */}
            <Route path="/" element={<Root />}>
              <Route path="/usuarios"element={ usuarioLogado && usuarioLogado.tipo === "Professor"? <Usuarios/> : <Navigate to="/perfil" />} />
              <Route path="/turmas" element={ usuarioLogado && usuarioLogado.tipo === "Professor" ? <Turmas/> : <Navigate to="/reviewalunos" />} />
              <Route path="/novaturma" element={ usuarioLogado && usuarioLogado.tipo === "Professor" ? <NovaTurma/> : <Navigate to="/perfil" />} />
              <Route path="/editarturma/:id" element={ usuarioLogado && usuarioLogado.tipo === "Professor" ? <EditarTurma/> : <Navigate to="/perfil" />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/alunos/:idTurma" element={usuarioLogado && usuarioLogado.tipo === "Professor" ? <Alunos/> : <Navigate to="/perfil" />} />
              <Route path="/reviewprofessor/:id" element={usuarioLogado && usuarioLogado.tipo === "Professor" ? <ReviewProfessor/> : <Navigate to="/perfil" />} />
              <Route path="/feedbackdoprofessor/:id" element={usuarioLogado && usuarioLogado.tipo === "Professor" ? <FeedbackDoProfessor/> : <Navigate to="/perfil" />} />
              <Route path="/editarfeedbackdoprofessor/:id"element={usuarioLogado && usuarioLogado.tipo === "Professor" ? <EditarFeedbackDoProfessor /> : <Navigate to="/perfil" />}/>

            </Route>
            {/* Rota alunos: */}
            <Route path="/" element={<Root />}>
              <Route path="/feedbackdoaluno" element={usuarioLogado && usuarioLogado.tipo === "Aluno" ? <FeedbackDoAluno/> : <Navigate to="/perfil" />} />
              <Route path="/reviewalunos" element={ usuarioLogado && usuarioLogado.tipo === "Aluno" ? <ReviewAlunos/> : <Navigate to="/perfil" />} />
              <Route path="/perfil" element={ usuarioLogado && usuarioLogado.tipo === "Aluno" ? <Perfil/> : <Navigate to="/perfil" />} />
            </Route>

            {/* Rota de pessoa sem cadastro */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthContext.Provider>
    </>
  );
}

