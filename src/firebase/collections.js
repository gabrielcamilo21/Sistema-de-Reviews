import { db } from "./config";
import { collection } from "firebase/firestore";

export const usuariosCollection = collection(db, "usuarios");
export const turmasCollection = collection(db, "turmas");
export const feedbacksCollection = collection(db,"feedbacks");
export const reviewsCollection = collection(db,"reviews");