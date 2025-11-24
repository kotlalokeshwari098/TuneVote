import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"


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
    const token=localStorage.getItem("token");
    const role=localStorage.getItem("role");

    const [showMyJams,setShowMyJams]=useState(false);
    const [showAllJams,setShowAllJams]=useState(false);

    const fetchAdminJamList=async()=>{
        const response=await axiosInstance.get('/api/songs/get-jamList',{
            headers:{
                Authorization:`Bearer ${token}`
        }})
        // console.log(response.data.data);
        return response.data.data;
    }

    const fetchAllJams=async()=>{
        const response=await axiosInstance.get('/api/songs/get-all-jams',{
            headers:{
                Authorization:`Bearer ${token}`
        }})
        // console.log(response.data.data);
        return response.data.data;
    }


    const {data}=useQuery({
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


  return (
    <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Jam Sessions</h1>
                    {role=="admin" ? 
                    <div className="flex gap-3">
                        <button
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${showMyJams ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'}`}
                            onClick={()=>{
                                setShowMyJams(true)
                                setShowAllJams(false)
                            }}>My Jams</button>
                        <button
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${showAllJams ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'}`}
                            onClick={()=>{
                                setShowAllJams(true)
                                setShowMyJams(false);
                            }}>All Jams</button>
                    </div>
                    :
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" onClick={()=>setShowAllJams(true)}>View All Jams</button>
                    }
                </div>
            </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
            <div className="max-w-6xl mx-auto">
                {showMyJams && 
                
                    data.length>0 && data.map((jam:jamData)=>(
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
                    ))
                
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
                            </div>
                        )):<div className="text-center text-gray-500 py-12">No jams found.</div>}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ViewJams