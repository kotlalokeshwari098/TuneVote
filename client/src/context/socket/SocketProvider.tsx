import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserContext } from '../../customhooks/useUserContext';
import { SocketContext } from './SocketContext';

interface SocketContextType {
  socket: Socket | null;
}

interface SocketProviderProps {
  children: ReactNode;
}

// const socket = io('http://localhost:5656/');

const SocketProvider = ({children}:SocketProviderProps) => {
   const user=useUserContext()
  //  console.log(user)
      const socketRef = useRef<Socket | null>(null);
    // console.log('SocketProvider user:', user);

useEffect(() => {
  if (!user.user?.id) return;
  const socket = io("http://localhost:5656/");
  socketRef.current = socket;

  
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
      socketRef.current = null;
    };
}, [user.user?.id]);


  return (
   <SocketContext.Provider value={{socket :socketRef.current}}>
     {children}
   </SocketContext.Provider>
  )
}

export default SocketProvider