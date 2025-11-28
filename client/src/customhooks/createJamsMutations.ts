import { useMutation } from "@tanstack/react-query"
import axiosInstance from "../api/axiosInstance"

export const useGetQRCode=()=>{
    return useMutation({
        mutationKey:["qrcodeunique"],
        mutationFn:async(url:string)=>{
            return await axiosInstance.post("/api/jam/generate-QR-Code",{url})
        }
    })
}

export const useGetSongsList=()=>{
        return useMutation({
            mutationKey:['songslist'],
            mutationFn:async(jamName:string | undefined)=>{
               return await axiosInstance.get(`/api/jam/${jamName}`)
            }
        })
}

export const useEndJamSession=()=>{
    return useMutation({
        mutationKey:['endsession'],
        mutationFn:async(jamName:string | undefined)=>{
           return await axiosInstance.put(`/api/jam/end-session/${jamName}`)
        }
    })
}