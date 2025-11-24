import { io} from 'socket.io-client';
import { useParams} from 'react-router';
import { useUserContext } from '../customhooks/useUserContext';

const socket=io("http://localhost:5656/")

const JamRoom = () => {
     const {jamName}=useParams();
    //  console.log(jamName)
     const {user}=useUserContext();
    //  console.log(user)
     const username=user?.username;

    socket.emit('join_room',{username,jamName})
    socket.on("message", (msg) => {
  console.log(msg)
})
  return (
    <div>JamRoom</div>
  )
}

export default JamRoom