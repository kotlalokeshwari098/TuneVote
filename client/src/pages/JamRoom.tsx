import { io} from 'socket.io-client';
import { useParams} from 'react-router';
import { useUserContext } from '../customhooks/useUserContext';
import { useGetSongsList } from '../customhooks/createJamsMutations';
import { useEffect, useState } from 'react';

const socket=io("http://localhost:5656/")

const JamRoom = () => {
     const {jamName}=useParams();
     const {user}=useUserContext();
     const [jamList,setJamList]=useState()
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

    socket.emit('join_room',{username,jamName})
    socket.on("message", (msg) => {
       console.log(msg)
     })
  return (
    <div>
       <div>
          songslist show here along with the upvote icon and also
       </div>
       <div>
          <div>number of participants online listing to jam</div>
          <div>chat show at right side</div>
       </div>
    </div>
  )
}

export default JamRoom