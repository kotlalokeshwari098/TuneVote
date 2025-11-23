import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UserProvider from './context/user/UserProvider.tsx'
import SocketProvider from './context/socket/SocketProvider.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>  
      <UserProvider>
        <SocketProvider>
          <App /> 
         <ReactQueryDevtools initialIsOpen={false} />
        </SocketProvider>    
      </UserProvider>        
  </QueryClientProvider>
)
