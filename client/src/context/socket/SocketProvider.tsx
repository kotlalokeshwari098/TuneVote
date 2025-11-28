import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserContext } from '../../customhooks/useUserContext';
import { SocketContext } from './SocketContext';



interface SocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL =
  import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5656';

const SocketProvider = ({children}:SocketProviderProps) => {
   const user=useUserContext()
  //  console.log(user)
   const [socket, setSocket] = useState<Socket | null>(null);

useEffect(() => {
  if (!user.user?.id) return;
  const socket = io(SOCKET_URL);
  setSocket(socket)

  
    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
      if (user.user?.id) {
        socket.emit("join", { userId: user.user?.id });
      }
    });

    socket.on("disconnect", () =>
      console.log("Disconnected from server", socket.id)
    );

   return () => {
      socket.disconnect(); 
    };
}, [user.user?.id]);


  return (
   <SocketContext.Provider value={{socket :socket}}>
     {children}
   </SocketContext.Provider>
  )
}

export default SocketProvider