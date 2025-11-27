import axiosInstance from "../api/axiosInstance";

export const authService={
    login: async (data:{email:string,password:string})=>{
        const response=await axiosInstance.post("/api/auth/login",data)
        return response.data;
    },

    register: async (data:{email:string,password:string,username:string})=>{
        const response=await axiosInstance.post("/api/auth/register",data)
        return response.data;
    },

    me:async()=>{
        const response=await axiosInstance.get("/api/auth/profile")
        return response.data;
    },

    logout: async ()=>{
        const response=await axiosInstance.post("/api/auth/logout")
        return response.data
    }
}