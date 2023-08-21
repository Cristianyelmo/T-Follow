import { auth, db } from '@/lib/firebase'
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BsBookmark, BsEmojiSmile, BsThreeDots } from 'react-icons/bs'
import { FaRegComment } from 'react-icons/fa'
import { IoShareOutline } from 'react-icons/io5'
import { uuidv4 } from '@firebase/util';
import { comment } from 'postcss'
import { GlobalContext, GlobalUserViewContext } from '@/state/context/GlobalContext'
import { onAuthStateChanged } from 'firebase/auth'
import useFetchCurrentUser from '@/utils/fetchCurrentUser'
const Post = ({id,username,image,caption,likesCount,imageProfile})=>{

    const{setPostId,setUserview,setProfileView,setProfile}=useContext(GlobalUserViewContext)
 const [IsLike,setIsLike]=useState(false)
 const[Comments,setComments]=useState()
const comment = useRef(null)
const{user}=useContext(GlobalContext)     













                                                                                                                                                                                                                                               
const handlePostComment = async (e)=>{
e.preventDefault()

const commentData ={
    id: uuidv4(),
    username:user.username,
    comment:comment.current.value,
    createdAt:serverTimestamp(),
    postId:id,
    userComment:username
}

comment.current.value = ''
const commentRef = doc(db,`posts/${id}/comments/${commentData.id}`)
await setDoc(commentRef,commentData)
}

const handleViewUser =(e)=>{
    e && setUserview(e)
    setProfileView(true)
    setProfile(false)
}


const handleLikePost = async ()=>{
   /*  setIsLike((prevState)=>!prevState) */

   const postLike ={
    postId:id,
    userId:auth.currentUser.uid,
    username,
    UserWhoGiveLike :user.username

   }

const likeRef = doc(db,`likes/${id}_${auth.currentUser.uid}`)
const postRef = doc(db,`posts/${id}`)


let updatedLikeCount 





if(IsLike){
await deleteDoc(likeRef);
if(likesCount){
    updatedLikeCount= likesCount -1
}else{
    updatedLikeCount=0
}

await updateDoc(postRef,{
likesCount:likesCount  - 1
})
}else{
    await setDoc(likeRef,postLike);
    if(likesCount){
        updatedLikeCount= likesCount +1
    }else{
        updatedLikeCount=1
    }
    
    await updateDoc(postRef,{
        likesCount:likesCount || 0 + 1
        })
}





}










useEffect(()=>{

const likesRef = collection(db,'likes')

const LikesQuery = query(
    likesRef,
    where('postId','==' ,id),  where('userId', '==', auth.currentUser.uid)
)

const unsubcribeLikes =    onSnapshot(LikesQuery,(snapshot)=>{
    const like =snapshot.docs.map((doc)=>doc.data())
    if(like.length !== 0){
        setIsLike(true)
    }else{
        setIsLike(false)
    }
})

const commentRef = collection(db,`posts/${id}/comments`)

const commentsQuery = query(
    commentRef,
    orderBy('createdAt','desc')
)

const unsubscribrComments = onSnapshot(commentsQuery,
    (snapsot)=>{
        const comments = snapsot.docs.map((doc)=>doc.data())
        setComments(comments)
    })


return () =>{
    unsubcribeLikes()
    unsubscribrComments()
}


},[id])






/* const[fino,setFino]=useState()
 const oki = Follows.map((data)=>{
    data.UserFollow === username  
}) */





    return(

        
        <div className="flex flex-col w-full bg-[#1B4DFF] p-[15px] rounded-[8px] mt-[15px] border-black/10">
        <div  className="flex items-center justify-between w-full py-2">
        <div onClick={()=>handleViewUser(username)} className="flex items-center justify-center space-x-2 ">
        <div  /* className="w-10 h-10 border-2 bg-black rounded-full" *//>
          <div  className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden '>
  <img src={imageProfile} />
  </div>
         <div className='text-white'>{username}</div>
        
        </div>
        
        
        <div onClick={()=>alert('chau')} className="select-none w-4"><BsThreeDots className="text-lg"/></div>
        
        </div>
        
        
        

<img src={image}  layout='fill' alt={caption}   className='object-cover' />
<div className='flex justify-between p-2 text-lg'>

        <div className='flex space-x-2'>

<div onClick={handleLikePost}>
{
    IsLike ? <AiFillHeart size={25} className='text-red-500 hover:text-black/50 cursor-pointer'/> :
    <AiOutlineHeart size={25} className='text-white hover:text-red/50 cursor-pointer'/>
}
    



</div>
<div className='text-white'>
           {likesCount ?`${likesCount} likes` : '0 likes'} 
        </div>

        </div>


        
        </div>


        
        <div className='p-2 text-xl text-white'>
            {caption}
        </div>
        <div className='px-2'>

            <div className='flex flex-col space-y-1'>
            { Comments && Comments.map((commentData)=>(
            <div key={commentData.id} className='flex space-x-2'>
                
                <div className='font-medium'>{commentData.username} </div>
                <div> {commentData.comment}</div>
              
                
                
                </div>
        ))
        
        }
        </div>
        
        </div>
    

        <div className='flex items-center px-2 mt-1 space-x-3  py-4 border-t border-gray-200'>
<div>
   <BsEmojiSmile className='text-xl text-white'/> 
</div>
<form onSubmit={handlePostComment} className='flex w-full px-2'>

<div  className='w-full'>
    <input type="text" 
    name={`comment ${id}`} 
    id={`comment ${id}`}
    className='w-full outline-none p-2 rounded-[3px]  ' placeholder='Add a comment..' ref={comment} />
</div>
<div >
<button className='text-lg font-semibold ml-5 mt-1  text-white'>Post</button>
</div>












</form>



        </div>
                       </div>


                       
    )
}

export default Post
