import { query, orderBy, addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { feedbacksCollection } from "./collections";

export async function getFeedbacks() {
  const q = query(feedbacksCollection, orderBy("dataEnvio", "desc"));
  const snapshot = await getDocs(q);
  const feedbacks = [];
  snapshot.forEach((doc) => {
    feedbacks.push({ ...doc.data(), id: doc.id });
  });
  return feedbacks;
}

export async function getFeedbacksId(id) {
  const document = await getDoc(doc(feedbacksCollection, id));
  return { ...document.data(), id: document.id };
}

export async function updateFeedbacks(id, data) {
  await updateDoc(doc(feedbacksCollection, id), data);
}

export async function deleteFeedbacks(id) {
  await deleteDoc(doc(feedbacksCollection, id));
}

export async function addFeedbacks(data) {
  const feedbacks = await getFeedbacks();
  const novaData = new Date(data.dataEnvio);
  await addDoc(feedbacksCollection, data);
}

