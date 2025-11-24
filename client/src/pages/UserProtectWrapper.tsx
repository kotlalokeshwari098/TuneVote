
import { useEffect } from 'react';
import { useNavigate, Outlet  } from 'react-router';



const UserProtectWrapper = () => {
    const navigate=useNavigate();
    const token=localStorage.getItem('token');

    useEffect(()=>{
        if(!token){
        navigate('/signup');
        }
    },[token,navigate])
  

  return <Outlet />
}

export default UserProtectWrapper