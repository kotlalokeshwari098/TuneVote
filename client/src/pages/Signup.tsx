import {useForm, type SubmitHandler} from "react-hook-form";
import { z} from 'zod';
import { Link } from "react-router";
import  axiosInstance  from '../api/axiosInstance.ts'
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";


const userFormSchema=z.object({
  email:z.string().email(),
  password:z.string().min(8),
  username:z.string().min(4),
})


type UserForm=z.infer<typeof userFormSchema>;


const Signup = () => {
  const {
    handleSubmit,
    register,
    formState:{errors},
    setError,
    reset
  }
    =useForm<UserForm>({
      defaultValues:{
        email:""
      },
      resolver:zodResolver(userFormSchema)
    });
    //register binds with input fields and handlesubmit validates the input 

    const submitUser=async(user:UserForm)=>{     
      // console.log("user",user)
      const formData={
         username:user.username,
         email:user.email,
         password:user.password,
         role:"admin"
      }
      const response=await axiosInstance.post('/api/auth/register',formData);
      return response.data;

    }

  const mutation=useMutation({
    mutationFn:submitUser,
    //directly sends the user object to submitUser fn
    onSuccess:()=>{
      alert("User Registered successfullyy!!");
      localStorage.setItem("role","admin");
      reset();     
    },
    onError:(error)=>{
      const message=error.message||"Something went wrong!";
      setError("root",{message})
    }
  
  })
 
  const onSubmit:SubmitHandler<UserForm>=async(user:UserForm)=>{
      mutation.mutate(user);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Sign up to start creating jam sessions</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-900 text-sm font-semibold mb-2">Username</label>
            <input 
              id="username"
              type="text"
              {...register("username")}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-900 text-sm font-semibold mb-2">Email</label>
            <input 
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-900 text-sm font-semibold mb-2">Password</label>
            <input 
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
              placeholder="Create a password (min 8 characters)"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
          >
            {mutation.isPending ? "Creating account..." : "Sign Up"}
          </button>
          
          {errors.root && (
            <div className="mt-4 p-3 text-center text-sm bg-red-50 text-red-700 rounded-md border border-red-200">
              {errors.root.message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to='/signin' className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign in
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

export default Signup