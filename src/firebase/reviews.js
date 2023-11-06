import {addDoc,deleteDoc,doc,getDoc,getDocs,orderBy,query,updateDoc,where,} from "firebase/firestore";
import { reviewsCollection } from "./collections";


export async function addReview(data) {
  await addDoc(reviewsCollection, data);
}

export async function getReviews(idAluno) {
  const q = query(reviewsCollection, where("idAluno", "==", idAluno), orderBy("dataEnvio", "desc"));
  const snapshot = await getDocs(q);
  const reviews = [];
  snapshot.forEach((doc) => {
    reviews.push({ ...doc.data(), id: doc.id });
  });
  return reviews;

}

export async function getReview(id) {
  const document = await getDoc(doc(reviewsCollection, id));
  return { ...document.data(), id: document.id };
}

export async function updateReviews(id, data) {
  await updateDoc(doc(reviewsCollection, id), data);
}

export async function deleteReviews(id) {
  await deleteDoc(doc(reviewsCollection, id));
}
