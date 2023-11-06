import { addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { usuariosCollection } from "./collections";
import { storage } from "./config"

export async function addUsuario(data) {
    await addDoc(usuariosCollection, data);
}

export async function getUsuarios() {
    const snapshot = await getDocs(usuariosCollection);
    let usuarios = [];
    snapshot.forEach(doc => {
        usuarios.push({...doc.data(), id: doc.id});
    })
    return usuarios;
}

export async function getUsuario(id) {
    const document = await getDoc(doc(usuariosCollection, id));
    return {...document.data(), id: document.id};
}

export async function updateUsuario(id, data) {
    await updateDoc(doc(usuariosCollection, id), data);
}

export async function deleteUsuario(id) {
    await deleteDoc(doc(usuariosCollection, id));
}

export async function uploadFotoUsuario(imagem) {
    const filename = imagem.name;
    const imageRef = ref(storage, `usuarios/${filename}`);
    const result = await uploadBytes(imageRef, imagem);
    return await getDownloadURL(result.ref);
}
