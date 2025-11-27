import React from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authServices';
import { useNavigate } from 'react-router';
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Profile : React.FC = () => {

  const navigate=useNavigate();

  const queryClient=useQueryClient();

  const logoutUser=async()=>{
    try{
       const response=await authService.logout();
       console.log(response);
        await queryClient.removeQueries({queryKey:['auth']})
        localStorage.removeItem('user')
         toast.success("Logout Successfull!")
        navigate('/signup')
    }
    catch(error){
        console.log(error)
    }
   
  }


  return (
    <div className="p-4 flex items-center space-x-3">
        <img src="https://avatar.iran.liara.run/public" alt="User" className="size-10 rounded-full object-cover" />
        <button onClick={() => logoutUser()} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <LogOut className="size-[16px]"/>
        </button>
    </div>
  )
}

export default Profile