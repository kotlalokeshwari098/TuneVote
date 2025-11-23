import { createContext } from "react"


export interface UserContextType{
    user:{
        id:string;
        username:string;
        email:string;
        isAdmin:boolean;
        socketId:string;
    } | null | undefined;
    setUser:React.Dispatch<React.SetStateAction<UserContextType['user'] | null | undefined>>;
}

export const UserContext=createContext<UserContextType | undefined>(undefined)


