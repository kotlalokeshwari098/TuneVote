import axiosInstance from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface JamData {
  id: number;
  jamname: string;
  qrcodeurl: string;
  qrcodepublicid: string;
  songslist: {
    id: number;
    name: string;
    image: { url: string; height: number; width: number }[];
  }[];
  uniqueroomjamid: string;
  user_id: number;
  username: string;
}

const JoinJam = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const token = localStorage.getItem('token');
   
   const fetchAllJams = async () => {
        const response = await axiosInstance.get('/api/songs/get-all-jams', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    }

    const { data: allJams } = useQuery({
        queryKey: ["alljams"],
        queryFn: fetchAllJams
    });

    const filteredJams = allJams?.filter((jam: JamData) =>
      jam.jamname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jam.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleJoinRoom = (roomId: string) => {
      console.log("Joining room:", roomId);
      // Add your join room logic here
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Join a Jam</h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search jams by name or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors text-lg"
          />
        </div>

        {/* Jams Grid */}
        {filteredJams && filteredJams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJams.map((jam: JamData) => (
              <div
                key={jam.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all hover:shadow-xl hover:shadow-purple-500/20"
              >
                {/* Jam Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{jam.jamname}</h3>
                  <p className="text-white/70 text-sm">
                    Created by <span className="font-semibold text-purple-300">{jam.username}</span>
                  </p>
                </div>

                {/* Songs Preview */}
                <div className="mb-4">
                  <p className="text-white/80 text-sm font-semibold mb-2">
                    {jam.songslist.length} Song{jam.songslist.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {jam.songslist.slice(0, 3).map((song) => (
                      <img
                        key={song.id}
                        src={song.image[0]?.url}
                        alt={song.name}
                        className="w-12 h-12 rounded-md object-cover"
                        title={song.name}
                      />
                    ))}
                    {jam.songslist.length > 3 && (
                      <div className="w-12 h-12 rounded-md bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                        +{jam.songslist.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinRoom(jam.uniqueroomjamid)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/70 text-lg mt-20">
            {searchQuery ? "No jams found matching your search." : "No jams available yet."}
          </div>
        )}
      </div>
    </div>
  )
}

export default JoinJam