import { BsThreeDots } from "react-icons/bs"
import Header from "../Header"

import Modal from "../Modal"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { GlobalContext, GlobalDispatchContext, GlobalUserViewContext } from "@/state/context/GlobalContext"

import { toast } from "react-hot-toast"
import { uuidv4 } from '@firebase/util';
import {auth, db, storage} from '../../lib/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import Post from "../Post"
import { useRouter } from "next/router"
import ModalHeart from "../ModalHeart"
import ProfileComponent from "../Profile"
import ProfileViewComponent from "../ProfileView"
const Feed =()=>{

   /*  const [IsOpen,setIsOpen] =useState(false) */

   const {isUploadPostModalOpen,NotificationModalOpen} = useContext(GlobalContext)
const dispatch = useContext(GlobalDispatchContext)

const{setUserview,setProfileView,setProfile,Profile,ProfileView,PostId}=useContext(GlobalUserViewContext)
const router = useRouter()
const handleViewUser =(e)=>{
    e && setUserview(e)
    setProfileView(true)
    setProfile(false)
}







    const closeModal =()=>{


        
            dispatch({
                type:'SET_IS_UPLOAD_POST_MODAL_OPEN',
                payload:{
                    isUploadPostModalOpen:false
                }
            })
        
        
        
        
           
        
        }

        const closeModalHeart =()=>{


        
            dispatch({
                type:'SET_IS_MODAL_NOTIFICATION',
                payload:{
                    NotificationModalOpen:false
                }
            })
        
        
        
        
           
        
        }
 

const[Follows,setFollows]=useState('')
const [File,setFile] = useState('')
const [Media,setMedia] = useState({
    src:'',
    isUploading:false,
    caption:''
})

useEffect(()=>{
    const reader = new FileReader()


const handleEvent = (e)=>{

    switch(e.type){
case 'load':
   
    return setMedia((prev)=>({
        ...prev,
        src:reader.result
    }))
 

   
case 'error':
    console.error(e)
    return toast.error('something not working')



default:
return




    }

}


if(File){
    reader.addEventListener('load',handleEvent)
    reader.addEventListener('error',handleEvent)
    reader.readAsDataURL(File)
}

return ()=>{
    reader.removeEventListener('load',handleEvent)
    reader.removeEventListener('error',handleEvent)
}


},[File])


const currentImage = useRef(null)
const {user} = useContext(GlobalContext)

const handlePostMedia = async (url)=>{
    const postId = uuidv4()
    const postRef = doc(db,'posts',postId)

    const post={
        id:postId,
        image:url,
        caption:Media.caption,
        username:user.username,
        createdAt: serverTimestamp(),
        imageProfile:user.imageProfile
    }
try{
await setDoc(postRef,post)
}catch(error){
console.error(error)
toast.error('error posting')
}



}




const handleUploadPost = async ()=>{

    if(!File) return toast.error('please select a image first')
    setMedia((prev)=>({...prev,isUploading:true}))
   const toastId = toast.loading('uploading your post,wait a minute') 
   const postName = `posts/${uuidv4()}-${File.name}`;
const storageRef = ref(storage,postName)

try{
const uploadTask = await uploadBytes(storageRef,File)
const url = await getDownloadURL(uploadTask.ref)
await handlePostMedia(url)
toast.success('post has uploaded',{
    id:toastId
})


}catch(error){
toast.error('failed to upload the image',{
    id:toastId
})
}finally{
setMedia({
    src:'',
    isUploading:false,
    caption: ''
})
setFile('')

closeModal()


}



}


const handleRemovePost = async()=>{
    setFile('')
    currentImage.current.src =''

}



const [posts, setPosts] = useState([]);
const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

 





const[FollowNoti,setFollowNoti] = useState()


useEffect(() => {
    setLoading(true);

    const followsCollection = collection(db, 'follow');
    const qFollow = query(followsCollection, where('Username','==',user.username));
    onSnapshot(qFollow, (snapshot) => {
      const follows = snapshot.docs.map((doc) => doc.data());
      setFollows(follows)
    });


   

   






    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection);
    onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => doc.data());
      setPosts(posts);
      setLoading(false);
    });
  }, []);
const[CommentsNoti,setCommentsNoti]=useState()

  useEffect(() => {
    setLoading(true);
    const userscollection = collection(db, 'users');
    const q = query(userscollection, orderBy('fullName', 'asc'));
    onSnapshot(q, (snapshot) => {
      const usersStory = snapshot.docs.map((doc) => doc.data());
   console.log(usersStory)
    setUsers(usersStory)
      setLoading(false);

   
    });
  }, []);

const[NotiLikes,setLikesNoti] = useState()
useEffect(()=>{
    const followsNotificationCollection = collection(db, 'follow');
    const qFollowNotification = query(followsNotificationCollection, where('UserFollow','==',user.username));
    onSnapshot(qFollowNotification, (snapshot) => {
      const followsNotification = snapshot.docs.map((doc) => doc.data());
     setFollowNoti(followsNotification)
    });

    const LikesNotificatCollection = collection(db, 'likes');
    const qLikesNotification = query(LikesNotificatCollection, where('username','==',user.username));
    onSnapshot(qLikesNotification, (snapshot) => {
      const likesNotification = snapshot.docs.map((doc) => doc.data());
     setLikesNoti(likesNotification)
    });
   



   



   

})











    return(
        <div className='w-full h-full bg-[#FAFAFA]' >
      <Header/>

      <Modal closeModal={closeModal} isOpen={isUploadPostModalOpen}>
        <div className="w-screen h-screen max-w-[70vh] max-h-[70vh] p-6 flex flex-col items-center">
            <div className="w-full py-4 text-xl text-center border-b border-black font-semibold">Create new post</div>
              


              <div className="w-full h-full flex justify-center items-center">
              {
                    !File ?( <>
                     <label htmlFor="post" className='bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition 
                disabled:bg-opacity-50 cursor-pointer disabled:scale-100 rounded text-sm font-semibold'>
                    Select from computer</label>


<input onChange={(e)=>setFile(e.target.files[0])}
                 type='file'
                  name='post'
                   id='post'
                    className="hidden"
                     multiple={false} 
                     accept="image/jpeg,image/png"
                      value={File.name}/>
                    </>)
                :
                    (<div className="flex flex-col p-5 gap-y-4">
                    <input type="image" src={Media.src} className="w-full" ref={currentImage}/> 
                    <input type='text' name='caption' id='caption' placeholder='Type your caption (optional...)'
                    onChange={(e)=>setMedia((prev)=>({...prev,caption:e.target.value}))} 
                    value={Media.caption}    className="w-full px-2 py-1 bg-gray-100 border rounded-sm outline-none hover:bg-transparent focus:bg-transparent placeholader:text-sm focus:border-gray-400"/>
<div className="flex items-center justify-center w-full gap-x-6">
    <button  className='bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition 
                disabled:bg-opacity-50 cursor-pointer disabled:scale-100 rounded text-sm font-semibold' onClick={handleRemovePost}>Remove</button>
     <button className='bg-[#0095F6] py-2 px-4 text-white active:scale-95 transform transition 
                disabled:bg-opacity-50 cursor-pointer disabled:scale-100 rounded text-sm font-semibold' onClick={handleUploadPost}>Upload</button>
</div>
                    
                    </div>)
                }


                
                
              </div>
              </div>
      </Modal>
        <ModalHeart closeModal={closeModalHeart} isOpen={NotificationModalOpen}>
        <div className="w-screen h-screen max-w-[70vh] max-h-[70vh] p-6 flex flex-col items-center">
      
 {
  FollowNoti &&  FollowNoti.map((data)=>
    <div>
   
   
<p>{data.Username} te ha seguido</p>
</div>
    
        
    )
} 


{

NotiLikes && NotiLikes.map((data)=>
posts.map((post)=>(
    data.postId === post.id &&
<div className="flex">


<p>{data.UserWhoGiveLike} te ha dado me gusta a esta foto</p>
<img src={post.image}  className="w-[60px] h-[60px]"  />
</div>

    
)))
} 



{

CommentsNoti && CommentsNoti.map((data)=>
posts.map((post)=>(
    data.postId === post.id &&
<div className="flex">


<p>{data.username} te ha comentado esta foto</p>
<img src={post.image}  className="w-[60px] h-[60px]"  />
<p>"{data.comment}"</p>
</div>

    
)))
} 




        </div>
        </ModalHeart>


{Profile ? <ProfileComponent/> : ProfileView ?
<ProfileViewComponent/> :


      <div className='grid w-full grid-cols-3 gap-6 max-w-screen-lg mt-20 mx-auto'>
      <div className="w-full   col-span-2">
            <section className="bg-white space-x-4 border-black/10 flex space-x-4 border-gray-400 p-4 overflow-x-scroll">

{


    Users.map((user)=>
    auth.currentUser.email !== user.email &&
    <div onClick={()=>handleViewUser(user.username)}>
    <div key={user.id} />
    <div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden '>
  <img src={user.imageProfile} />
  </div>
    <p>{ user.username}</p>
    </div>



    )

}

            </section>
            <section className="flex flex-col gap-y-3">
             {
           posts.map((post)=>(
Follows.map((postxd)=>(
(postxd.UserFollow === post.username ) &&
                    <Post key={post.id} {...post}  />
                    ))
                    ))
             }

            </section>
        </div>
        

        

      </div>
      }

        </div>
    )


}

export default Feed