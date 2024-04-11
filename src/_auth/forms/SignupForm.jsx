
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useToast} from '@/components/ui/use-toast'
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupValidation } from "@/lib/validation"
import Loader  from '@/components/ui/shared/Loader'
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

 

function SignupForm() {
  const {toast} = useToast();
  const { checkAuthUser,isPending:isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const {mutateAsync:createUserAccount, isPending:isCreatingAccount} = useCreateUserAccount();
  
  const{mutateAsync:signInAccount,isPending:isSigningIn} = useSignInAccount();

// 1. Define your form.
const form = useForm({
  resolver: zodResolver(signupValidation),
  defaultValues: {
    name: "",
    username: "",
    email: "",
    password: "",
  }
})

// 2. Define a submit handler.
async function onSubmit(user) {
  const newUser = await createUserAccount(user);
  
  if(!newUser){
    return toast({title:'sign up failed.please try again.'})
  }

  const session = await signInAccount({
    email:user.email,
    password:user.password
  });

  if(!session){
    return toast({title:'sign in failed. Please try again.'})
  }

  const isLoggedIn = await checkAuthUser();

  if(isLoggedIn){
    form.reset();
    navigate('/')
  }else{
    return toast({title:'Sign up failed. Please try again.'})
  }
}
  return (
    <Form {...form}>
      <div>
        <img src="/assets/images/logo.svg" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use SnapGram, please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
               <Loader/> Loading...
              </div>
            ): "Sign up"}
          </Button>

          <p className=" text-small-regular text-light-2 text-center mt-2">
            Already have an acoount?
            <Link to="/sign-in" className=" text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>  
    </Form>
      
  )
}

export default SignupForm