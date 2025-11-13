import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800 p-6">
       <div className="max-w-4xl mx-auto">
         <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
           <h2 className="text-2xl font-semibold text-white">Jams</h2>

           {role=="admin" ? 
           <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-white/10 text-white rounded-md border border-white/20 hover:bg-white/20 transition"
                  onClick={()=>{
                      setShowMyJams(true)
                      setShowAllJams(false)
                  }}>View My Jams</button>
                <button
                  className="px-4 py-2 bg-white/10 text-white rounded-md border border-white/20 hover:bg-white/20 transition"
                  onClick={()=>{
                      setShowAllJams(true)
                      setShowMyJams(false);
                  }}>View All Jams</button>
           </div>
           :
           <div className="text-white/90 cursor-pointer" onClick={()=>setShowAllJams(true)}>View All Jams</div>
           
           }
         </header>

       {showMyJams && 
       
          data.length>0 && data.map((jam:jamData)=>(
            <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-4" key={jam.id}>
                <div className="text-white font-medium text-lg mb-3" >{jam.jamname}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {jam.songslist.map((song)=>(
                    <div className="flex items-center gap-4 bg-white/3 p-3 rounded-md" key={song.id}>
                        <img src={song.image[0].url} alt={song.name} className="w-20 h-20 object-cover rounded-md"/>
                        <div className="text-white">
                          <div className="font-semibold">{song.name}</div>
                        </div>
                    </div>
                  ))}
                </div>
            </div>
          ))
       
       }
       {showAllJams &&
         <div className="text-white/90 p-4 bg-white/5 border border-white/10 rounded-md">
            {allJams && allJams.length>0 ? allJams.map((jam:alljamData)=>(
                <div key={jam.id} className="mb-6">
                    <div className="text-white font-medium text-lg mb-3">{jam.jamname} <span className="text-sm text-white/70">by {jam.username} </span></div>  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {jam.songslist.map((song)=>(
                            <div key={song.id} className="flex items-center gap-4 bg-white/3 p-3 rounded-md" >
                                <img src={song.image[0].url} alt={song.name} className="w-20 h-20 object-cover rounded-md"/>
                                <div className="text-white">
                                  <div className="font-semibold">{song.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )):<div className="text-white/70">No jams found.</div>}
         </div>
       }

   
       </div>
    </div>
  )
}

export default ViewJams