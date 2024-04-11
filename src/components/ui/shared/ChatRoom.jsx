import Loader from '@/components/ui/shared/Loader';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
//import { permission } from '@/lib/appwrite/api';
import { appwriteConfig, client } from '@/lib/appwrite/config';

import { useCreateMessage, useDeleteMessage, useGetCreator, useGetMessages, useGetUserById } from '@/lib/react-query/queriesAndMutations';
import React, { useEffect, useState } from 'react'
import {Trash2} from 'react-feather'
import { useLocation, useParams } from 'react-router-dom';

const ChatRoom = () => {
    
    const {id} = useParams()
    const {user} = useUserContext()
    const {toast} = useToast();
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('')
    //const{mutateAsync:subscribe} = useSubscribe();

    const {data,isLoading,isError} = useGetMessages()
    const {mutateAsync:payload} = useCreateMessage()
    const {mutateAsync:MessageId} = useDeleteMessage()
    const{data:creator,isLoading:isLoadingGetuser,isError:isErrorGetuser} = useGetUserById(id)
    
    useEffect(()=>{

      getMessages() 
  
      const unsubscribe =  client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`, function (response) {
        //callback will be executed on changes for documents 
        if(response.events.includes( "databases.*.collections.*.documents.*.create")){
         // console.log('A message is created');
        setMessages((prevMessages) => [response.payload, ...prevMessages]);
        }
        if(response.events.includes( "databases.*.collections.*.documents.*.delete")){
         // console.log('A message was deleted');
      setMessages(() => messages.filter((message) => message.$id !== response.payload.$id));
        }
        }
    )
    return (()=> {
      unsubscribe()
    })

    },[creator]) 
  
  if(isError){
    toast({title:"something went wrong."});
  }

  const getMessages = async() =>{
     const response =  data;
    if (!response) {
      console.log("something get wrong to get message response...");
    }
    //console.log( "response : ",data.documents);
    setMessages(response.documents)
  }
  
  
  const handleSubmit = async (e)=>{
    e.preventDefault()

   

    const response = await payload ({body:messageBody,
                                     user_id:user.id,
                                     username:user.name})


    setMessageBody('')
  }

  const deleteMessage = async (message_id) =>{
    const deletedMessage = await MessageId(message_id)
    
    if(!deletedMessage){
      toast({
        title: `delete Message failed. Please try again.`,
      });
     }

  }
  return (

    <main className='container '>
      <div className='flex w-full flex-row'>
    <div className='min-w-80 w-full '>
          <div  className='flex gap-4 mt-8 ml-7'>

              {isLoadingGetuser ? <Loader/> : (
              <>
                <img src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                       alt="creator"
                       className=' rounded-full w-14 h-14' />
                  
                <div className='flex flex-col'>

                    <p className='body-bold'>
                       {creator.name}
                    </p>
                    <p className='small-regular text-light-3'>
                       @{creator.username}
                    </p>

                </div>
              </>)}
              
          </div>

          
    </div>
  </div>


      <div className='room--container'>   

        <form onSubmit={handleSubmit} id='message--form'>
          <div>
            <textarea 
               className=' bg-gray-900'
               required
               maxLength="1000"
               placeholder='Say something...'
               onChange={(e)=>{setMessageBody(e.target.value)}}
               value={messageBody}>
            </textarea>
          </div>

          <div className='send-btn--wrapper'>
            <input className ='btn btn--secondary' type="submit" value='Send' />
          </div>
        </form>
        <div>
            {messages.map(message => {
      
                if(creator?.$id == message.user_id || message.user_id === user.id){
                  return (
              <div key={message.$id} className='message--wrapper'>

                <div className='message--header'>
                 <p>
                    {message ?.username ? (
                     <span>{message?.username}</span>
                     ):(
                     <span>Anonymous user</span>
                     )
                    }

                   <small className = "message-timestamp">{(new Date(message.$createdAt).toLocaleString())}</small> 
                 </p>
   
                 {(
                     <Trash2
                     className='delete--btn'
                     onClick={()=>{deleteMessage(message.$id)}}/>
                 )}
               
               </div>

                 <div className={'message--body' + (message.user_id === user.$id ? 'message--body--owner' : '')}>
                   <span>{isLoading ? <Loader/>:message.body}</span>
                 </div>
              </div>)
              }
            })}
        </div>
      </div>    
    </main>
    
  )
}

export default ChatRoom