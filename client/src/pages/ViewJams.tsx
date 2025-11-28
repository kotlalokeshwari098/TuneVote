import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"
import { useNavigate } from "react-router"
import { AxiosError } from "axios"
import Profile from "./Profile"

interface jamData {
    id:number,
    user_id:number,
    jamname:string,
    songslist:
        {
            id:number,
            image:{
                height:number,
                url:string,
                width:number
            }[],
            name:string
        }[]
    
}

interface alljamData extends jamData{
    username:string
}



const ViewJams = () => {
    const navigate=useNavigate();

    const [showMyJams,setShowMyJams]=useState<boolean>(false);
    const [showAllJams,setShowAllJams]=useState<boolean>(false);
    const [showEnterCode,setShowEnterCode]=useState<boolean>(false);
    const [jamname,setJamname]=useState<string>("");
    const [roomCode,setRoomCode]=useState<string>("")

    const fetchAdminJamList=async()=>{
        const response=await axiosInstance.get('/api/songs/get-jamList')
        // console.log(response.data.data);
        return response.data.data;
    }

    const fetchAllJams=async()=>{
        const response=await axiosInstance.get('/api/songs/get-all-jams')
        // console.log(response.data.data);
        return response.data.data;
    }


    const {data:myJams}=useQuery({
        queryKey:["jamlist"],
        queryFn:fetchAdminJamList
    })

    const {data:allJams}=useQuery({
        queryKey:["alljams"],
        queryFn:fetchAllJams
    })

    useEffect(()=>{
      setShowAllJams(true);
    },[])

    const validateRoomCode=async()=>{
       try {
        const response=await axiosInstance.post(`/api/jam/${roomCode}`)
        if(response.status==200){
            alert(response.data.message)
            navigate(`/jam-room/${jamname}`)
        }
       
       } catch (error) {
        const err = error as AxiosError<{ message: string }>; 
        const backendMessage = err.response?.data?.message; 
        alert(backendMessage || "Something went wrong");
       }
    }


  return (
    <div className="min-h-screen bg-white">

        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">

                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Jam Sessions
                </h1>
 
                <div className="flex items-center gap-3">
  
                    <button
                    onClick={() => {
                        setShowMyJams(true);
                        setShowAllJams(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border 
                        ${showMyJams
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                        }`}
                    >
                    My Jams
                    </button>

                    <button
                    onClick={() => {
                        setShowAllJams(true);
                        setShowMyJams(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border 
                        ${showAllJams
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                        }`}
                    >
                    All Jams
                    </button>

                    <Profile />
                </div>
                </div>
            </div>
        </nav>


        <div className="container mx-auto px-6 py-8">
            <div className="max-w-6xl mx-auto">
                {showMyJams &&
                 <div className="space-y-6">
                    {myJams.length>0 ? myJams.map((jam:jamData)=>(
                        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-6" key={jam.id}>
                            <div className="text-gray-900 font-semibold text-xl mb-4">{jam.jamname}</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {jam.songslist.map((song)=>(
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200" key={song.id}>
                                        <img src={song.image[0].url} alt={song.name} className="w-16 h-16 object-cover rounded"/>
                                        <div className="text-gray-900 text-sm font-medium">{song.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div> 
                    )):<div className="text-center text-gray-500 py-12">Create jams now!</div>}
                     </div>
                
                }
                {showAllJams && (
                    <div className="space-y-6">
                        {allJams && allJams.length>0 ? allJams.map((jam:alljamData)=>(
                            <div key={jam.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-gray-900 font-semibold text-xl">{jam.jamname}</div>
                                    <div className="text-gray-500 text-sm">by <span className="text-indigo-600">{jam.username}</span></div>
                                </div>  
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {jam.songslist.map((song)=>(
                                        <div key={song.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                                            <img src={song.image[0].url} alt={song.name} className="w-16 h-16 object-cover rounded"/>
                                            <div className="text-gray-900 text-sm font-medium">{song.name}</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={()=>{
                                    setShowEnterCode(prev=>!prev)
                                    setJamname(jam.jamname)
                                }}
                                className={`px-4 py-2 rounded-md font-medium transition-colors bg-indigo-600 text-white mt-5`}
                                    >join room</button>
                            </div>
                        )):<div className="text-center text-gray-500 py-12">No jams found.</div>}
                    </div>
                )}

                {showEnterCode && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm flex flex-col gap-4">
                    
                    <p className="text-lg font-semibold text-center">
                        Enter the code to join <span className="text-blue-600">{jamname}</span>
                    </p>

                    <input
                        type="text"
                        className="border p-2 rounded-md w-full"
                        placeholder="Enter code"
                        value={roomCode}
                        onChange={(e)=>setRoomCode(e.target.value)}
                    />

                    <button className="bg-blue-600 text-white py-2 rounded-md"
                    onClick={()=>validateRoomCode()}
                    >
                        OK
                    </button>

                    </div>
                </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ViewJams