import ChatRoom from '@/components/ui/shared/ChatRoom';
import Loader from '@/components/ui/shared/Loader';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { useGetCreator} from '@/lib/react-query/queriesAndMutations'
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Chat = () => {

  const {toast} = useToast();
 const {user} = useUserContext()
   
  const {
    data:creators,
    isLoading:isUserLoading,
    isError:isErrorCreators
  } = useGetCreator(10);

  if(isErrorCreators){
    toast({title:"something went wrong."});
  }

  return (
    <div className='flex w-full '>
    <div className=' flex px-6 py-10 flex-col justify-between min-w-[370px]'>
    <div className='flex flex-col gap-11 '>
      <h3 className='h3-bold md:h2-bold text-left w-full'>All Users</h3>
      {isUserLoading && !creators? (
        <Loader />
      ) : (
        <ul className='gap-3 items-center '>
          {creators?.documents.map((creator) =>(
            
            <li key={creator?.$id}
                className='flex-1 min-w-[200px] w-full '>
                {creator.$id!=user.id && 
                <NavLink 
                 
                to={`/chat/${creator.$id}`}
                className={({isActive})=>`flex flex-row gap-6 mb-5 rounded-xl ${isActive ? " bg-dark-3" : "bg-black"}`}>
                <img src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"} 
                     alt="creator"
                     className=' rounded-full w-14 h-14'
                    />
                    
               
               <div className='flex-center flex-col gap-1'>
                   <p className='base-medium text-light-1 text-center line-clamp-1'>
                    {creator.name}
                   </p>
                   <p className='small-regular text-light-3 text-lef w-full line-clamp-1'>
                    @{creator.username}
                   </p>
               </div>
               
             </NavLink>}  
               
              
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  <section className='hidden md:flex flex-1 h-full'>
        <Outlet /> 
  </section>

  </div>
  )
}

export default Chat