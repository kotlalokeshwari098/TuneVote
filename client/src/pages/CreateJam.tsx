import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";
import { generateUniqueId } from "../utils/generateUniqueId";
import { useGetQRCode } from "../customhooks/createJamsMutations";

type song={
   id:number,
   image:[{
        height:number,
        url:string,
        width:number
     }],
   name:string
}

const CreateJam = () => {
    const [songsInJam,setSongsInJam]=useState<song[]>([]);
    const [inputSong,setInputSong]=useState("");
    const [debounceCue,SetDebounceCue]=useState("");
    const [jamName,setJamName]=useState("");
    const [QRCode,setQRCode]=useState("")
    const [uniqueRoomId,setUniqueRoomId]=useState<string>()
    const token=localStorage.getItem("token")

    const getQrCode=useGetQRCode();

    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        alert("Jam Created Successfully!");
        mutation.mutate(e);
    }

    const submitJam=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const response1 = await fetch(QRCode);
        const blob = await response1.blob();

        const formData=new FormData()
        formData.append("name",jamName)
        formData.append("songs",JSON.stringify(songsInJam))
        formData.append("roomId",uniqueRoomId)
        formData.append("qrcode",blob,"qr.png")
        const response=await axiosInstance.post('/api/songs/create-jam',formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        // console.log(response,"responseeeuuu");
        return response.data.message;
    }

    const mutation=useMutation({
        mutationFn:submitJam,
        onSuccess:()=>{
          alert("Jam submitted successfullyy!!");
          setSongsInJam([]);
        },
        onError:(error)=>{
        alert(error.message);
        }
    })


   const fetchSongs = async ({ queryKey }: { queryKey: [string, string] }) => {
      const [ _key,inputSong] = queryKey;

      if (!inputSong) return []; 

      const response = await axiosInstance.get(
         `/api/songs/search-song?query=${inputSong}`
      );
    //   console.log(response.data.data)
      return response.data.data;
     };

      //trigger the search if the debounceCue changes where it change only when user stops typing for 1.2 sec
      const {status,error,data}=useQuery({ 
         queryKey:['searchSongs',debounceCue], 
         queryFn:fetchSongs,
         enabled:debounceCue.length>0
      })


      //for debouncing the search input and changing the debounceCue only when user stops typing for 1.2 sec to trigger the tanquery to fetch the songs (as it fetches when there will be any change in the key we provided)
       useEffect(()=>{ 
         const id=setTimeout(() => { 
            SetDebounceCue(inputSong);
         }, 
            1200);           
            return ()=>clearTimeout(id);
         },
      [inputSong]) 

      if(status==="error"){
         return <div>Error:{(error as Error).message}</div>
      }

      const addToJamList=(track:song)=>{
          setSongsInJam((prev)=>[...prev,track]);
      }

      const removeJamSong=(id:number)=>{
         setSongsInJam((prev)=>prev.filter((song)=> song.id!=id));
      }



      const generateIdAndQRCode=async()=>{
         const getUniqueId=generateUniqueId(jamName);
         const fullURL = `http://localhost:5656/api/jam/room/${getUniqueId}`;
         const response=await getQrCode.mutateAsync(fullURL);
        //  console.log(response)
         setQRCode(response.data.data)
         setUniqueRoomId(getUniqueId)
      }

   
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Create New Jam</h1>
            
            <div className="relative mb-6">
               <div className="flex justify-center items-center">
                  <label className="block text-white text-lg font-semibold mb-2">Search Songs:</label>
                  <input 
                     type="text"
                     value={inputSong}
                     onChange={(e)=>{
                           setInputSong(e.target.value)
                     }}
                     className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                     placeholder="Search for a song..."
                  />
                  <button onClick={()=>setInputSong("")}>X</button>
                  <Link to='/view-jams'>View Jams</Link>
               </div>
               
                {data && data.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-80 overflow-y-auto">
                        {data.map((track:song, index:number) => (
                            <div key={index} className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0">
                                <div className="text-white font-medium flex justify-between">
                                  <div>{track.name}</div>
                                  <button onClick={()=>addToJamList(track)}>Add</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {status === "pending" && inputSong && (
                    <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 px-4 py-3">
                        <div className="text-white/70">Loading...</div>
                    </div>
                )}
            </div>

            {songsInJam.length>0 && <form className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="mb-5" >
                <label className="block text-white text-lg font-semibold mb-2">Jam Name:</label>
                 <input 
                 className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors" 
                 placeholder="Enter Jam Name"
                 value={jamName}
                 onChange={(e)=>setJamName(e.target.value)}
                 />
            </div>
                <div>{songsInJam?.map((song,index)=>(
                  <div key={index} className="flex justify-between mb-5">
                     <p className="text-white">{song.name}</p>
                     <br />
                     <img src={song?.image[0].url} alt={song.name} className="w-16 h-16 rounded-md"/>
                     <button type="button" onClick={()=>{
                        removeJamSong(song.id)
                        // console.log(song,"song to remove")
                     }}>Remove</button>
                  </div>
                ))}</div>
                <button type="button" onClick={()=>generateIdAndQRCode()}>Generate QR Code</button>
                {QRCode && <img src={QRCode} alt="QR Code" />}
                {uniqueRoomId && <div>unqiue Room id : {uniqueRoomId}</div>}
                <input type="submit"/>
            </form>}
        </div>
    </div>
  )
}

export default CreateJam