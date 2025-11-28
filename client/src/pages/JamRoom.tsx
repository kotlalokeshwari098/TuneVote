// import { io} from 'socket.io-client';
import { useParams} from 'react-router';
import { useUserContext } from '../customhooks/useUserContext';
import { useGetSongsList } from '../customhooks/createJamsMutations';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import { useContext } from 'react';
import { SocketContext } from '../context/socket/SocketContext';

interface Song {
  songslist:{
    name: string;
    id: string;
    image: { url: string; height: number; width: number }[];
  }[],
  created_by:string  
}


interface message{
   username:string;
   message:string;
   timestamp?:string;
}

const JamRoom = () => {
     const {jamName}=useParams();
     const {user}=useUserContext();
     const [jamList,setJamList]=useState<Song | null>(null)
     const [message,setMessage]=useState("");
     const [chatMessages,setChatMessages]=useState<message[]>([])
     const [roomJammers,setRoomJammers]=useState<number>(0);
    //  console.log(user)
     const username=user?.username;
     const socket = useContext(SocketContext)?.socket;

     useEffect(() => {
        if (!socket) return;
      }, [socket]);


     const getJamList=useGetSongsList()

     const getAllJamList=async()=>{
      const response= await getJamList.mutateAsync(jamName);
      // console.log(response);
      setJamList(response.data.data)
     }
     
      useEffect(()=>{
      getAllJamList()
      },[])

    // console.log(jamList)
    useEffect(() => {
        if (!username || !jamName) return;

        socket?.emit('join_room', { username, jamName });
    }, [username, jamName,socket]);

    useEffect(() => {
      const handleMessage = (msg:message) => console.log(msg);
      const handleInitialChat = (msgs:message[]) =>{
      // console.log(msgs,"msgssss")
      setChatMessages(msgs);}

      socket?.on("message", handleMessage);
      socket?.on("initial_chat", handleInitialChat);

      return () => {
        socket?.off("message", handleMessage);
        socket?.off("initial_chat", handleInitialChat);
      };
    }, [socket]);

    const sendMessage = () => {
      if (!message) return;
      socket?.emit("chat", {jamName, username, message, timestamp: dayjs(Date.now()).format('HH:mm') });
      setMessage(""); 
    };


    useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg:message) => {
      setChatMessages(prev => [...prev, msg]);
      // console.log(msg, "updated msgggg");
    };

    socket.on("chat_message", handleChatMessage);
    socket.on("room_users",({count})=>{
      setRoomJammers(count);
    })

    
    return () => {
      socket.off("chat_message", handleChatMessage);
    };
  }, [socket]); 



  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{jamName}</h1>
              <p className="text-sm text-gray-500 mt-1">Jam Session</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">{roomJammers} Live</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Playlist */}
          <div className="lg:col-span-2">
         

            {/* Song Queue */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Song Queue</h2>
                <span className="text-sm text-gray-500">{jamList?.songslist?.length || 0} songs</span>
              </div>

              <div className="space-y-3">
                {jamList && jamList.songslist?.length > 0 ? (
                  jamList.songslist.map((song) => (
                    <div key={song.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                      <div className="flex items-center gap-4">
                        {/* Album Art */}
                        <img 
                          src={song.image[0]?.url} 
                          alt={song.name} 
                          className="w-16 h-16 rounded object-cover"
                        />
                        
                        {/* Song Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{song.name}</h3>
                          <p className="text-sm text-gray-500">Added by <span className="text-indigo-600 font-medium">{jamList.created_by || 'Unknown'}</span></p>
                        </div>

                        {/* Upvote Button */}
                        <button className="flex flex-col items-center gap-1 px-4 py-2 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg transition-colors group">
                          <svg className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600">0</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No songs in the queue yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Chat */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Chat</h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages && chatMessages.map((msg)=>(
                  msg.username==username ?
                  <div className="flex gap-3 justify-end">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">{msg?.username?.slice(0,1).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{msg.username}</p>
                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                    <span className="text-xs text-gray-400 mt-1">{msg.timestamp}</span>
                  </div>
                </div>:
                  <div className="flex gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">{msg?.username?.slice(0,1).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{msg.username}</p>
                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                    <span className="text-xs text-gray-400 mt-1">{msg.timestamp}</span>
                  </div>
                </div>))
                }
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e)=>{
                      setMessage(e.target.value)
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 text-sm"
                  />

                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors" type='submit' onClick={()=>sendMessage()}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JamRoom