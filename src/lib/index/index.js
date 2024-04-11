  
  const INavLink = {
    imgURL: '',
    route: '',
    label: '',
  };
  
   const IUpdateUser = {
    userId: '',
    name: '',
    bio: '',
    imageId:'',
    imageUrl: '',
    file: []
  };
  
   const INewPost = {
    userId: '',
    caption: '',
    file: [],
    location:'', 
    tags: ''
  };
  
  const IUpdatePost = {
    postId: '',
    caption:'',
    imageId: '',
    imageUrl: '',
    file: [],
    location:'', 
    tags: ''
  };
  
  const IUser = {
    id: '',
    name:'',
    username:'', 
    email: '',
    imageUrl: '',
    bio: ''
  };
  
  const INewUser = {
    name:'', 
    email: '',
    username: '',
    password: '',
  }

export{
    INewUser,IUser,IUpdatePost,INewPost, IUpdateUser,INavLink 
}