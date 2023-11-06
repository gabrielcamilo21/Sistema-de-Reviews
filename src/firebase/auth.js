import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config";
import { setDoc, doc } from "firebase/firestore";

export async function CadastrarEmailSenha(nome, idTurma, email, senha) {
  const resultado = await createUserWithEmailAndPassword(auth, email, senha);
  const usuarioRef = doc(db, "usuarios", resultado.user.uid);
  await setDoc(usuarioRef, {
    nome,
    idTurma,
    email,
    tipo: "Aluno",
  });
  console.log(usuarioRef);
  
  return resultado.user;
}
export async function logout() {
  await signOut(auth);
}

export async function loginEmailSenha({ email, senha }) {
  const res = await signInWithEmailAndPassword(auth, email, senha);
  return res.user;
}


