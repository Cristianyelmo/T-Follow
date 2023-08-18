import Header from "@/components/Header"
import { auth, db } from "@/lib/firebase"
import { GlobalContext, GlobalUserViewContext } from "@/state/context/GlobalContext"
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"

const ProfileViewComponent = ()=>{

  const{UserView}=useContext(GlobalUserViewContext)


const[DataOtherUser,setDataOtherUser]=useState([])
const[DataOtherUserPost,setDataOtherUserPost]=useState([])
const[Follow,setFollow]=useState(false)
const {user}=useContext(GlobalContext)

const[disabledFollow,setDisabled] = useState(false)
const handleFollow = async () =>{
  setDisabled(true)
 /*  setFollow((prev)=>!prev) */
 try {
  
 /*  setFollow(false) */
  let UserFllowidLet = DataOtherUser[0].id

  let FollowCountLet = DataOtherUser[0].FollowCount
  
  const follow={
    UserFollow:UserView,
    UserFollowId: UserFllowidLet,
    Username:user.username
  }

const followRef = doc(db,`follow/${UserView}_${user.username}`)
const UserRef = doc(db,`users/${DataOtherUser[0].email}`)

let updatedFollowCount 



  if(Follow){
    await deleteDoc(followRef);
    if(FollowCountLet){
        updatedFollowCount= FollowCountLet -1
    }else{
        updatedFollowCount=0
    }
    
    await updateDoc(UserRef,{
    FollowCount:updatedFollowCount  /* - 1 */
    }) 
    }else{
        await setDoc(followRef,follow);
        if(FollowCountLet){
            updatedFollowCount= FollowCountLet +1
        }else{
            updatedFollowCount=1
        }
        
        await updateDoc(UserRef,{
            FollowCount:updatedFollowCount /* || 0 + 1 */
            })
    } 
    

    
  
} catch (error) {
  console.error
}finally {
  setDisabled(false)
}



   
  
  
   }






useEffect(()=>{
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection,where('username','==',UserView));
  onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc) => doc.data());
    setDataOtherUser(users)
   
  })


  const postCollection = collection(db, 'posts');
  const qPost = query(postCollection,where('username','==',UserView));
  onSnapshot(qPost, (snapshot) => {
    const post = snapshot.docs.map((doc) => doc.data());
    setDataOtherUserPost(post)
   
  })

  const FollowCollection = collection(db, 'follow');
  const qFollow = query(FollowCollection,where('UserFollow','==',UserView),where('Username','==',user.username));
  onSnapshot(qFollow, (snapshot) => {
    const FollowsView = snapshot.docs.map((doc) => doc.data());
   if(FollowsView.length !== 0){
    setFollow(true)
   }else{
    setFollow(false)
   }
   
  })







    

 

},[])




  





 













 return( <div>


 <div>
<div >
<button onClick={handleFollow} className={!Follow ? 'w-[90px] bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]' :'w-[120px] bg-white py-2 px-6 text-black active:scale-95  border-red transform transition disabled:bg-[#98b2c3] '} disabled={disabledFollow}>{!Follow ? 'Seguir' : 'Dejar de seguir'} </button>:

  </div>
 { DataOtherUser.map((data)=>(
<div>

 <p>{data.username}</p>

     <h2>{data.FollowCount}</h2>

</div>
 

 
 

 ))
 }


<div>

{ 
                DataOtherUserPost.map((post)=>(

              /*     post.username === UserView && */
                  <div>
                    <img src={post.image}   />
                  </div>
                   
                    ))
             
 }



</div>



 </div>
  </div>

)

   }
export default ProfileViewComponent