import GridPostList from '@/components/ui/shared/GridPostList';
import Loader from '@/components/ui/shared/Loader';
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import React from 'react'

const Saved = () => {

  const {data:currentUser} = useGetCurrentUser();

  const savePosts = currentUser?.save
        .map((savePosts)=>({
          ...savePosts.post,
          creator:{
            imageUrl:currentUser.imageUrl,
          },
        })).reverse();
  
  return (
    <div className='saved-container'>
      <div className='flex gap-2 w-full max-w-5xl'>
        <img 
           src="/assets/icons/save.svg" 
           alt="edit" 
           width={36}
           height={36}
           className='invert-white'
        />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
      </div>

      {!currentUser ?(
        <Loader />
      ):(
        <ul className='w-full flex justify-center max-w-5xl gap-9'>
          {savePosts.length === 0 ? (<p className='text-light-4'> no available posts</p>):(
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  )
}

export default Saved