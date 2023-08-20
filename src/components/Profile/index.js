/* import Header from "@/components/Header" */
import { auth, db } from "@/lib/firebase"
import { GlobalContext, GlobalUserViewContext } from "../../state/context/GlobalContext"
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"

const ProfileComponent = ()=>{
 
 const {user}=useContext(GlobalContext)  

const[postsProfile,setpostsProfile]=useState([])
  const[Myuser,setUser]=useState([])  


const handleDeletePost = async (id)=>{
  const PostRef = doc(db,`posts/${id}`)
    await deleteDoc(PostRef);
}





useEffect(()=>{
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection);
  onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => doc.data());
    setpostsProfile(posts)
  })


  const usersCollection = collection(db, 'users');
  const quser = query(usersCollection,where('id','==' ,auth.currentUser.uid));
  onSnapshot(quser, (snapshot) => {
    const users = snapshot.docs.map((doc) => doc.data());
    setUser(users)
  })


 
  






},[])


  












 return( <div>
{/*  <Header/> */}

 <div>

 {  Myuser.map((user)=>( 
<div className="bg-[#1B4DFF] flex p-7 m-5 rounded-[8px] shadow-md">


 <div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden '>
  <img src={user.imageProfile} />
  </div>

 <div className=" flex flex-col ml-5 " >





  <div className=" flex flex-col justify-content: center">


    <div>
<p className="text-white">  {user.username}   </p>
<p className="text-white">{user.fullName}</p>
</div>


</div>



<div className=" flex">
<p className="text-white">{user.FollowCount ? user.FollowCount : "0"} seguidores</p>
<p className=" ml-2 text-white">{user.FollowWhoCount ? user.FollowWhoCount : "0"} seguidos</p>
</div>




</div>

</div>))}



<div >

{
                postsProfile.map((post)=>(

                  post.username === user.username &&
                  <div className="bg-[#1B4DFF]  p-7 m-5 rounded-[8px] shadow-md">
                    <img src={post.image}   />
                    <button onClick={()=>handleDeletePost(post.id)}>Eliminar</button>
                  </div>
                   
                    ))
             }




</div>



 </div>
  </div>

)

   }
export default ProfileComponent