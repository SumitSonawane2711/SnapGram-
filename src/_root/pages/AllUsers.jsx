import Loader from '@/components/ui/shared/Loader'
import UserCard from '@/components/ui/shared/UserCard'
import { useToast } from '@/components/ui/use-toast'
import { useGetCreator } from '@/lib/react-query/queriesAndMutations'
import React from 'react'


const AllUsers = () => {

  const {toast} = useToast();
  const {
    data:creators,
    isLoading:isUserLoading,
    isError:isErrorCreators
  } = useGetCreator(10);

  if(isErrorCreators){
    toast({title:"something went wrong."});
  }

  return (
    
    <div className=' common-container'>
      <div className='user-container'>
        <h3 className='h3-bold md:h2-bold text-left w-full'>All Users</h3>
        {isUserLoading && !creators? (
          <Loader />
        ) : (
          <ul className='user-grid'>
            {creators?.documents.map((creator) =>(
              <li key={creator?.$id}
                  className='flex-1 min-w-[200px] w-full '>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AllUsers