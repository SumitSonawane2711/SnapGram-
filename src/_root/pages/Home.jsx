import PostCard from '@/components/ui/shared/PostCard';
import UserCard from '@/components/ui/shared/UserCard';
import { useGetCreator, useGetRecentPosts, useGetUsers } from '@/lib/react-query/queriesAndMutations';
import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';


const Home = () => {
  
  const {ref,inView} = useInView();
  const {data:users , fetchNextPage,hasNextPage} = useGetUsers();
  const {data:posts,isPending:isPostLoading,isError:isErrorPosts}=useGetRecentPosts();

  const{
    data:creators,
    isLoading:isUserLoading,
    isError:isErrorCreators,
  } = useGetCreator(10);
  
  useEffect(()=>{
    if (inView){
      fetchNextPage();
    }
  },[inView]);

  return (
    <div className='flex flex-1 '>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>
            Home Feed
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ):(
            <ul className='flex flex-col flex-1 gap-9 w-full'>
               {posts?.documents.map((post) => (
               <PostCard post={post} key={post.caption}/>
               ))}
              {hasNextPage && (
                <div ref={ref} className='mt-10'>
                <Loader/>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    

      <div className='home-creators'>
        <h3 className='h3-bold text-light-1'>Top Creators</h3>
        {isUserLoading && !creators? (
          <Loader />
        ) : (
          <ul className='grid 2xl:grid-cols-2 gap-6'>
            {creators?.documents.map((creator) =>(
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home