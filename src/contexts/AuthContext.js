import { createContext } from "react"; 
import { toast } from "react-hot-toast";

export function isLogado(user) {
    if (!user) {
        toast.error("Você precisa estar logado para acessar esta página.",
            { position: "bottom-right", duration: 2500 });
        return false;
    }
    return true;
}

export const AuthContext = createContext();
