import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";
import { generateUniqueId } from "../utils/generateUniqueId";
import { useGetQRCode } from "../customhooks/createJamsMutations";

type song={
   id:number,
   image:{
        height:number,
        url:string,
        width:number
     }[],
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
    <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create Jam Session</h1>
                    <Link to='/view-jams' className="text-indigo-600 hover:text-indigo-700 font-medium">View Jams</Link>
                </div>
            </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="relative mb-8">
                    <label className="block text-gray-900 text-sm font-semibold mb-2">Search Songs</label>
                    <div className="relative">
                        <input 
                            type="text"
                            value={inputSong}
                            onChange={(e)=>{
                                setInputSong(e.target.value)
                            }}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                            placeholder="Search for a song..."
                        />
                        {inputSong && (
                            <button 
                                onClick={()=>setInputSong("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                   
                    {data && data.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                            {data.map((track:song, index:number) => (
                                <div key={index} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
                                    <div className="flex justify-between items-center">
                                        <div className="text-gray-900">{track.name}</div>
                                        <button 
                                            onClick={()=>addToJamList(track)}
                                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {status === "pending" && inputSong && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-3 shadow-lg">
                            <div className="text-gray-500">Loading...</div>
                        </div>
                    )}
                </div>

                {songsInJam.length>0 && (
                    <form className="bg-gray-50 rounded-lg p-6 border border-gray-200" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-900 text-sm font-semibold mb-2">Jam Name</label>
                            <input 
                                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600" 
                                placeholder="Enter Jam Name"
                                value={jamName}
                                onChange={(e)=>setJamName(e.target.value)}
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-900 text-sm font-semibold mb-3">Songs ({songsInJam.length})</label>
                            <div className="space-y-3">
                                {songsInJam?.map((song,index)=>(
                                    <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                                        <img src={song?.image[0].url} alt={song.name} className="w-12 h-12 rounded"/>
                                        <p className="text-gray-900 flex-1">{song.name}</p>
                                        <button 
                                            type="button" 
                                            onClick={()=>removeJamSong(song.id)}
                                            className="text-gray-500 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {QRCode && (
                            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                                <img src={QRCode} alt="QR Code" className="mx-auto"/>
                            </div>
                        )}
                        
                        {uniqueRoomId && (
                            <div className="my-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Room Code:</p>
                                <p className="text-gray-900 font-mono text-lg font-semibold">{uniqueRoomId}</p>
                            </div>
                        )}
                        
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={()=>generateIdAndQRCode()}
                                className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-900 rounded-lg font-medium"
                            >
                                Generate QR Code
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                            >
                                Create Jam
                            </button>
                        </div>
                        
                        
                    </form>
                )}
            </div>
        </div>
    </div>
  )
}

export default CreateJam