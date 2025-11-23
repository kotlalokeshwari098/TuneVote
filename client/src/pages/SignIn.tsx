import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form'
import {z} from 'zod';
import axiosInstance from '../api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useUserContext } from '../customhooks/useUserContext';

const formschema=z.object({
  email:z.string().email(),
  password:z.string().min(5)
})

type FormData=z.infer<typeof formschema>

const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState:{errors},
  } = useForm<FormData>({
    resolver:zodResolver(formschema)
  });
  const navigate=useNavigate();
  const {user,setUser}=useUserContext()

  const submitUser=async(user:FormData)=>{
    const response=await axiosInstance.post('/api/auth/login',user);
    return response.data;
  }

  console.log(user)

  const mutation=useMutation({
     mutationFn:submitUser,
     onSuccess:(data)=>{
      console.log(data)
      localStorage.setItem("token",data.data.token)
      localStorage.setItem("role","admin")
      alert("login successfull");
      const userData=data.data.userWithoutPassword
      localStorage.setItem("user",JSON.stringify(userData));
      setUser(userData);
      reset();
      navigate('/create-jam')
     },
     onError:()=>{
      alert("Error! Please try again later!");
     }
  })

  const onSubmit:SubmitHandler<FormData>=(data)=>{
    // console.log(data,"data")
      mutation.mutateAsync(data);  
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}> 
      <div>
         <label>Email:</label>
         <input type='email' {...register("email")}/>
         <p>{errors.email?.message}</p>
      </div>
      <div>
         <label>password:</label>
         <input type='password' {...register("password")}/>
         <p>{errors.password?.message}</p>
      </div>
      <input type='submit' />

    </form>
  )
}

export default SignIn