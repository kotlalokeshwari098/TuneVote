import axiosInstance from "../api/axiosInstance";

export const jamService={
    allJams:async()=>{
        const response = await axiosInstance.get('/api/songs/get-all-jams');
        return response.data.data;
    }
}