import { io} from 'socket.io-client';
import { useParams} from 'react-router';
import { useUserContext } from '../customhooks/useUserContext';
import { useGetSongsList } from '../customhooks/createJamsMutations';
import { useEffect, useState } from 'react';

const socket=io("http://localhost:5656/")

interface Song {
  name: string;
  id: string;
  image: { url: string; height: number; width: number }[];
}

const JamRoom = () => {
     const {jamName}=useParams();
     const {user}=useUserContext();
     const [jamList,setJamList]=useState<Song[]>([])
    //  console.log(user)
     const username=user?.username;

     const getJamList=useGetSongsList()

     const getAllJamList=async()=>{
      const response= await getJamList.mutateAsync(jamName);
      console.log(response);
      setJamList(response.data.data)
     }
     
      useEffect(()=>{
      getAllJamList()
      },[])

console.log(jamList)
    socket.emit('join_room',{username,jamName})
    socket.on("message", (msg) => {
       console.log(msg)
     })

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
                <span className="text-sm font-medium text-green-700">255 Live</span>
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
                <span className="text-sm text-gray-500">{jamList?.length || 0} songs</span>
              </div>

              <div className="space-y-3">
                {jamList && jamList.length > 0 ? (
                  jamList.map((song) => (
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
                          <p className="text-sm text-gray-500">Added by <span className="text-indigo-600 font-medium">{username || 'Unknown'}</span></p>
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
                {/* Message 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">J</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">john_doe</p>
                    <p className="text-sm text-gray-600 mt-1">Great playlist! 🎵</p>
                    <span className="text-xs text-gray-400 mt-1">2:35 PM</span>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">sarah_music</p>
                    <p className="text-sm text-gray-600 mt-1">Love this song!</p>
                    <span className="text-xs text-gray-400 mt-1">2:36 PM</span>
                  </div>
                </div>

                {/* Message 3 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">M</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">mike_rocks</p>
                    <p className="text-sm text-gray-600 mt-1">Can we add more rock songs? 🎸</p>
                    <span className="text-xs text-gray-400 mt-1">2:37 PM</span>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 text-sm"
                  />
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
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