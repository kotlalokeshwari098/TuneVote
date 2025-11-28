import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { jamService } from "../services/jamService";

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

const JoinJam : React.FC = () => {
   const [searchQuery, setSearchQuery] = useState("");
   

    const { data: allJams } = useQuery({
        queryKey: ["alljams"],
        queryFn: jamService.allJams
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
    <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">Join a Jam Session</h1>
            </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="max-w-2xl mb-10">
                    <input
                        type="text"
                        placeholder="Search by jam name or creator..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                    />
                </div>

                {/* Jams Grid */}
                {filteredJams && filteredJams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJams.map((jam: JamData) => (
                            <div
                                key={jam.id}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-indigo-600 transition-colors"
                            >
                                {/* Jam Header */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{jam.jamname}</h3>
                                    <p className="text-gray-500 text-sm">
                                        by <span className="text-indigo-600 font-medium">{jam.username}</span>
                                    </p>
                                </div>

                                {/* Songs Preview */}
                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm font-medium mb-3">
                                        {jam.songslist.length} song{jam.songslist.length !== 1 ? 's' : ''}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {jam.songslist.slice(0, 4).map((song) => (
                                            <img
                                                key={song.id}
                                                src={song.image[0]?.url}
                                                alt={song.name}
                                                className="w-14 h-14 rounded object-cover border border-gray-200"
                                                title={song.name}
                                            />
                                        ))}
                                        {jam.songslist.length > 4 && (
                                            <div className="w-14 h-14 rounded bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 text-sm font-semibold">
                                                +{jam.songslist.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Join Button */}
                                <button
                                    onClick={() => handleJoinRoom(jam.uniqueroomjamid)}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Join Session
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-16">
                        {searchQuery ? "No jams match your search." : "No active jam sessions."}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default JoinJam