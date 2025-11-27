
import { useEffect } from 'react';
import { useNavigate, Outlet  } from 'react-router';



const UserProtectWrapper = () => {
    const navigate=useNavigate();
    const user=localStorage.getItem('user');

    useEffect(()=>{
        if(!user){
        navigate('/signup');
        }
    },[user,navigate])
  

  return <Outlet />
}

export default UserProtectWrapper