import { auth, db } from '@/lib/firebase'
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiFillDelete, AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BsBookmark, BsEmojiSmile, BsThreeDots } from 'react-icons/bs'
import { FaRegComment } from 'react-icons/fa'
import { IoShareOutline } from 'react-icons/io5'
import { uuidv4 } from '@firebase/util';
import { comment } from 'postcss'
import { GlobalContext, GlobalUserViewContext } from '@/state/context/GlobalContext'
import { onAuthStateChanged } from 'firebase/auth'
import useFetchCurrentUser from '@/utils/fetchCurrentUser'
import Swal from 'sweetalert2'
const MyPost = ({id,username,image,caption,likesCount,imageProfile})=>{

    const{setPostId,setUserview,setProfileView,setProfile}=useContext(GlobalUserViewContext)
 const [IsLike,setIsLike]=useState(false)
 const[Comments,setComments]=useState()
const comment = useRef(null)
const{user}=useContext(GlobalContext)     




const handleDeletePost = async (id)=>{
    Swal.fire ({
        title: 'Quieres Eliminar el Post?',
        showDenyButton: true,
        background:'#1B4DFF',
         color: 'white',
        confirmButtonText: 'Eliminar',
        denyButtonText: `No eliminar`,
      }).then((result)  => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire({title:'Post eliminado',
          background:'#1B4DFF',
         color: 'white'})
           const PostRef = doc(db,`posts/${id}`)
       deleteDoc(PostRef);
        } else if (result.isDenied) {
          Swal.fire({title:'Post no eliminado',
        background:'#1B4DFF',
         color: 'white'})
        }
      })
    
   
  }








                                                                                                                                                                                                                                               
const handlePostComment = async (e)=>{
e.preventDefault()
setInputStr('')

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

const[disabledFollow,setDisabled] = useState(false)


const handleLikePost = async ()=>{
   /*  setIsLike((prevState)=>!prevState) */
   setDisabled(true)

   try{

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
likesCount:updatedLikeCount
})
}else{
    await setDoc(likeRef,postLike);
    if(likesCount){
        updatedLikeCount= likesCount +1
    }else{
        updatedLikeCount=1
    }
    
    await updateDoc(postRef,{
        likesCount:updatedLikeCount 
        })
}


}catch (error) {
    console.error
  }finally {
    setDisabled(false)
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

const[inputStr,setInputStr]=useState('')
const[showPicker,setShowPicker]=useState(false)

   const handleEmojiClick = emoji => {
    const updatedValue = inputStr + emoji;
  
    setInputStr( updatedValue);
    setShowPicker(false)
   };

   
   const emojis = [
      { name: "smiling face with heart-eyes", unicode: "😍", code: ":heart_eyes:" },
      { name: "grinning face", unicode: "😎 ", code: ":grinning:" },
      { name: "winking face", unicode: "❤️ ", code: ":wink:" },
      { name: "smiling face", unicode: "🤣  ", code: ":smile:" },
      { name: "slightly smiling face", unicode: "😳 ", code: ":slightly_smiling_face:" },
      { name: "kissing face", unicode: "😒 ", code: ":kissing_face:" }
   ];




    return(

        
        <div className="flex flex-col w-full bg-[#1B4DFF] p-[15px] rounded-[8px] mt-[15px] border-black/10">
        <div  className="flex items-center justify-between w-full py-2">
        <div></div>
        <div  onClick={()=>handleDeletePost(id)} className="cursor-pointer text-white bg-[#ff0000] p-2 ">
       
       
       
     
         
          <AiFillDelete className=' text-right'/>
        
        
        </div>
        
        
        
        
        </div>
        
        
        

<img src={image}  layout='fill' alt={caption}   className='object-cover' />
<div className='flex justify-between p-2 text-lg'>

        <div className='flex space-x-2'>



 <button onClick={handleLikePost} disabled={disabledFollow}>{IsLike ?<AiFillHeart size={25} className='text-red-500 hover:text-black/50 cursor-pointer'/>:
     <AiOutlineHeart size={25} className='text-white hover:text-red/50 cursor-pointer'/>}</button>  






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
                
                <div className='font-bold text-white'>{commentData.username} </div>
                <div  className=' text-white'> {commentData.comment}</div>
              
                
                
                </div>
        ))
        
        }
        </div>
        
        </div>
    

        <div className='flex items-center px-2 mt-1 space-x-3  py-4 border-t border-gray-200'>

<form onSubmit={handlePostComment} className='flex flex-col w-full px-2'>
<div className='flex'>
<div  onClick={()=>setShowPicker(val => !val)} className='mr-4 mt-3'>
   <BsEmojiSmile className='text-xl text-white cursor-pointer'/> 
</div>


<div  className='w-full'>
    <input type="text" 
    name={`comment ${id}`} 
    id={`comment ${id}`}
    className='w-full outline-none p-2 rounded-[3px]  ' placeholder='Add a comment..' value={inputStr} onChange={(e)=>setInputStr(e.target.value)}  ref={comment} />
</div>
<div >
<button className='text-lg font-semibold ml-5 mt-1  text-white'>Post</button>
</div>
</div>

{
   showPicker && <div className="" id='emoji-picker'>
   
      <div className="flex"> 
         {Object.keys(emojis).map(emoji => (
         <span 
            key={emoji}
            onClick={() =>
            handleEmojiClick(emojis[emoji].unicode)}
            className="bg-[#6283fb] p-1 mx-1 my-1 cursor-pointer rounded-[2px]" >
            {emojis[emoji].unicode}
         </span>
      ))}
   </div>
</div>
}









</form>



        </div>
                       </div>


                       
    )
}

export default MyPost