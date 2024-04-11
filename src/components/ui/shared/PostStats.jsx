import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const PostStats = ({post,userId}) => {
  
  const likesList = post.likes.map((user)=>user.$id)
  
  const [likes,setLikes]= useState(likesList);
  const [isSaved,setIsSaved ]= useState(false)

  const {mutate:likePost} = useLikePost()
  const {mutate:savePost} = useSavePost()
  const {mutate:deleteSavedPost} = useDeleteSavedPost()
  
  const{data :currentUser} = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find((record) => record.post.$id === post.$id);
   
  useEffect(()=>{
    setIsSaved(!!savedPostRecord)
  },[currentUser])

  //const postId = post.$id;

  const handleLikedPost = (e) => {
    
    e.stopPropagation();

    let LikesArray = [...likes];

    if(LikesArray.includes(userId)){
      LikesArray = LikesArray.filter((id) => id!== userId);
    }
    else {
      LikesArray.push(userId)
    }
    
    setLikes(LikesArray);
    likePost(post?.$id,LikesArray)
  }

  const handleSavePost = (e) => {
    e.stopPropagation();


    if(savedPostRecord){
      setIsSaved(false);
      return deleteSavedPost(savedPostRecord.$id)
    }
    
    savePost(post?.$id,userId)
    setIsSaved(true)
  }

  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
            <img src={checkIsLiked(likes,userId) 
                      ? "/assets/icons/liked.svg"
                      : "/assets/icons/like.svg"
                     } 
                 alt="like"
                 width={20}
                 height={20}
                 onClick={(e) => handleLikedPost(e)}
                 className='cursor-pointer'
            />
            <p className='small-medium lg:base-medium'>{likes.length}</p>
        </div>

        <div className='flex gap-2 '>
        
             <img src={isSaved ? "/assets/icons/saved.svg": "/assets/icons/save.svg" }
                 alt="share"
                 width={20}
                 height={20}
                 onClick={(e) => handleSavePost(e)}
                 className='cursor-pointer'
            />
        </div>
    </div>
  )
}

export default PostStats