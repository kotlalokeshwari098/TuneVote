import { useMutation } from "@tanstack/react-query"
import axiosInstance from "../api/axiosInstance"

export const useGetQRCode=()=>{
    const token=localStorage.getItem("token");
    return useMutation({
        mutationKey:["qrcodeunique"],
        mutationFn:async(url:string)=>{
            return await axiosInstance.post("/api/jam/generate-QR-Code",{url},{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        }
    })
}

export const useGetSongsList=()=>{
    const token=localStorage.getItem("token");
        return useMutation({
            mutationKey:['songslist'],
            mutationFn:async(jamName:string | undefined)=>{
               return await axiosInstance.get(`/api/jam/${jamName}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
               })
            }
        })
}