import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../textarea'
import FileUploader from '../shared/FileUploader'
import { postFormValidation } from '@/lib/validation'
import { useUserContext } from '@/context/AuthContext'
import { useToast } from '../use-toast'
import { useNavigate } from 'react-router-dom'
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queriesAndMutations'
import Loader from '../shared/Loader'

const PostForm = ({post,action}) => {
    const {mutateAsync:createPost, isPending: isLoadingCreate} = useCreatePost();
    const {mutateAsync:updatePost, isPending: isLoadingUpdate} = useUpdatePost()

    const{user} = useUserContext();
    const {toast} = useToast();
    const navigate = useNavigate();

    // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(postFormValidation),
    defaultValues: {
      caption: post ? post?.caption :"",
      file:[],
      location:post ? post?.location :"", 
      tags:post? post?.tags : "",
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async(values) => {
    if(post && action === 'Update'){
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageUrl:post?.imageUrl,
        imageId: post?.imageId
      })

      if(!updatedPost){
        toast({title:"Please try again"})
      }

      return navigate(`/posts/${post.$id}`)
    }


   const newPost = await createPost({
    ...values,
    userId:user.id,
   })
   
   if(!newPost){
    toast({title:'Please try again'})
   }

   navigate('/');
  }
  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar"{...field} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl }
                />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>
              <FormControl>
                <Input type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Tags (seperated by comma " , ")</FormLabel>
              <FormControl>
                <Input 
                  type='text' 
                  className='shad-input' 
                  placeholder='js,react,NextJs'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
          )}
        />
        <div className='flex gap-4 items-center justify-end'>
           <Button 
             onClick = {()=>navigate(-1)} 
             type="button"
             className='shad-button_dark_4'
            >Cancel
           </Button>

           <Button 
             type="submit"
             className='shad-button_primary whitespace-nowrap'
              disabled={isLoadingCreate || isLoadingUpdate}
            >
              {isLoadingCreate || isLoadingUpdate && 'Loading...'}
              {action} Post
           </Button>
        </div>
        
      </form>
    </Form>
  )
}

export default PostForm