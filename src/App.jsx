
import './globals.css'
import { Route,Routes } from 'react-router-dom'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import { AllUsers, CreatePost, EditPost, Explore, Home, 
         LikedPosts, 
         PostDetails, Profile, Saved,  }  from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import {Toaster} from '@/components/ui/toaster'
import UpdateProfile from './_root/pages/UpdateProfile'
import LikedPost from './_root/pages/LikedPosts'
import Chat from './_root/pages/chat'
import ChatRoom from './components/ui/shared/ChatRoom'

const  App = ()=> {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-up' element={<SignupForm/>}/>
          <Route path='/sign-in' element={<SigninForm />}/>
        </Route>
        
        {/* private routes */}
        <Route element={<RootLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='/explore' element={<Explore/>} />
          <Route path='/saved' element={<Saved/>} />
          <Route path='/all-users' element={<AllUsers/>} />
          <Route path='/create-post' element={<CreatePost/>} />
          <Route path='/update-post/:id' element={<EditPost/>} />
          <Route path='/posts/:id' element={<PostDetails/>} />
          <Route path='/profile/:id/*' element={<Profile/>} />
          <Route path='/LikedPosts/:id' element={<LikedPosts/>} /> 
          <Route path='/update-profile/:id' element={<UpdateProfile/>} />
          <Route path='/chat' element={<Chat/>}>
              <Route path='/chat/:id' element={<ChatRoom/>} />
          </Route>
        </Route>
      </Routes>

      <Toaster/>
    </main>
  )
}

export default App