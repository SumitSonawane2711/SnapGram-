import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/shared/Loader'
import { ProfileUploader } from '@/components/ui/shared/ProfileUploader'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { UseUpdateUser, useGetUserById } from '@/lib/react-query/queriesAndMutations'
import { editProfileValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

const UpdateProfile = () => {

  const {toast} = useToast();
  const navigate = useNavigate()
  const {id} = useParams();
  const{user,setUser} = useUserContext();
  const {data:currentUser} = useGetUserById(id || "")

  const form = useForm({
    resolver: zodResolver(editProfileValidation),
    defaultValues: {
      file:[],
      name: user.name,
      username: user.username,
      email:user.email,
      bio: user.bio || "",
    },
  })

  const { mutateAsync: updateUser, isLoading: isLoadingUpdate,isError} = UseUpdateUser()

  if(!currentUser){
    return (
    <div className="flex-center w-full h-full">
      <Loader/>
    </div>
    )
  }

  const handleUpdate = async(value) => {
     const updatedUser = await updateUser({
      userId: user.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
     })
     
     if(!updatedUser){
      toast({
        title: `Update user failed. Please try again.`,
      });
     }
     setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
     })

     return navigate(`/Profile/${id}`)
  }

  return (
    <div className='saved-container'>
      <div className='flex gap-2 w-full max-w-5xl'>
        <img 
           src={"/assets/icons/edit.svg"} 
           alt="edit" 
           width={36}
           height={36}
           className='invert-white'
        />
        <h1 className='h3-bold mid:h2-bold text-left w-full'>Edit Profile</h1>
      </div>
      {/* <div className='flex xl:flex-row flex-col max-xl:flex-row gap-7 w-full max-w-5xl '>
        <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} 
             alt="profile" 
             className='w-28 h-28 lg:h-36 lg:w-36 rounded-full '/>

        <Link className='flex-center text-blue-500 ' >change profile photo</Link>     
      </div> */}
      
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleUpdate)}
               className='flex flex-col gap-7 w-full max-w-5xl'>

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
                
            <FormField 
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className='shad-form_label'>Name</FormLabel>
                   <FormControl>
                     <Input type="text" placeholder={currentUser.name} className='shad-input '{...field}/>
                   </FormControl>
                   <FormMessage className='shad-form_message'/>
                 </FormItem>
               )} 
            />

            <FormField 
               control={form.control}
               name="username"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className='shad-form_label'>Username</FormLabel>
                   <FormControl>
                   <Input type="text" placeholder={currentUser.username} className='shad-input ' {...field}/>
                   </FormControl>
                   <FormMessage className='shad-form_message'/>
                 </FormItem>
               )} 
            />

            <FormField 
               control={form.control}
               name="email"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className='shad-form_label'>Email</FormLabel>
                   <FormControl>
                     <Input type="text" placeholder={currentUser.email} className='shad-input ' {...field}/>
                   </FormControl>
                   <FormMessage className='shad-form_message'/>
                 </FormItem>
               )} 
            />

            <FormField 
               control={form.control}
               name="bio"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className='shad-form_label'>Bio</FormLabel>
                   <FormControl>
                     <Textarea placeholder={currentUser.bio} className="shad-textarea custom-scrollbar"{...field} />
                   </FormControl>
                   <FormMessage className='shad-form_message'/>
                 </FormItem>
               )} 
            />
            
            <div className='flex justify-end w-full max-w-5xl gap-4'>
              <Button 
                 type ='button' 
                 onClick = {()=>navigate(-1)} 
                 className='sha-button_primary whitespace-nowrap bg-rose-700'>
                Cancel
              </Button>
            
              <Button 
                 type = 'submit' 
                 className='shad-button_primary whitespace-nowrap '
                 disable = {isLoadingUpdate}>
                  {isLoadingUpdate && <Loader/>}
                  Update Profile
              </Button>
            </div>
         </form>
      </Form>
    </div>
    
  )
}

export default UpdateProfile