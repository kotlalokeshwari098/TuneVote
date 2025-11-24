import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form'
import {z} from 'zod';
import axiosInstance from '../api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router';
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
           
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <div className="mb-6">
            <label className="block text-gray-900 text-sm font-semibold mb-2">Email</label>
            <input 
              type='email' 
              {...register("email")}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email?.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 text-sm font-semibold mb-2">Password</label>
            <input 
              type='password' 
              {...register("password")}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password?.message}</p>
            )}
          </div>

          <button 
            type='submit'
            disabled={mutation.isPending}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn