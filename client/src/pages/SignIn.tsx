import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form'
import {z} from 'zod';

const formschema=z.object({
  username:z.string(),
  password:z.string().min(5)
})

type FormData=z.infer<typeof formschema>

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState:{errors},
  } = useForm<FormData>({
    resolver:zodResolver(formschema)
  });
  const onSubmit:SubmitHandler<FormData>=(data)=>{
       console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}> 
      <div>
         <label>username:</label>
         <input type='text' {...register("username")}/>
         <p>{errors.username?.message}</p>
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