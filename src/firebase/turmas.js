import {Query,addDoc,collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where,} from "firebase/firestore";
import { turmasCollection } from "./collections";
import { db } from "./config";


  export async function addTurmas(data) {
    await addDoc(turmasCollection, data);
  }
  
  export async function getTurmas() {
    const snapshot = await getDocs(turmasCollection);
    let turmas = [];
    snapshot.forEach((doc) => {
      turmas.push({ ...doc.data(), id: doc.id });
    });
    return turmas;
  }
  
  export async function getTurma(id) {
    const document = await getDoc(doc(turmasCollection, id));
    return { ...document.data(), id: document.id };
  }
  
  export async function updateTurmas(id, data) {
    await updateDoc(doc(turmasCollection, id), data);
  }
  
  export async function deleteTurma(id) {
    await deleteDoc(doc(turmasCollection, id));
  }

  export function getAlunosDaTurma(codigo) {
    return new Promise((resolve, reject) => {
      const alunosCollection = collection(db, 'usuarios');
      const alunosQuery = query(alunosCollection, where('idTurma', '==', codigo));
  
      getDocs(alunosQuery)
        .then((querySnapshot) => {
          const alunos = [];
          querySnapshot.forEach((doc) => {
            alunos.push({ id: doc.id, ...doc.data() });
          });
          resolve(alunos);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

