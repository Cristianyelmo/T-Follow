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
const[FollowWho,setFollowWho]=useState()
const[disabledFollow,setDisabled] = useState(false)
const[UserFollowWhoFollow,setUserFollowWho]=useState()
 



const handleFollow = async () =>{
  setDisabled(true)
 /*  setFollow((prev)=>!prev) */
 try {
  
 /*  setFollow(false) */
  let UserFllowidLet = DataOtherUser[0].id

   let FollowCountLet = DataOtherUser[0].FollowCount 
   let UserFollowWho = UserFollowWhoFollow[0].FollowWhoCount 
  const follow={
    UserFollow:UserView,
    UserFollowId: UserFllowidLet,
    Username:user.username,
    ImageFollow:user.imageProfile
  }

const followRef = doc(db,`follow/${UserView}_${user.username}`)
const UserRef = doc(db,`users/${DataOtherUser[0].email}`)
const UserWhoFollow = doc(db,`users/${user.email}`) 
let updatedFollowCount 

let updatedFollowCountWho

  if(Follow){
    await deleteDoc(followRef);
    if(FollowCountLet ){
        updatedFollowCount= FollowCountLet -1
         
    }else{
        updatedFollowCount=0
    
    }


     

    


    
    await updateDoc(UserRef,{
    FollowCount:updatedFollowCount  /* - 1 */
    }) 

    

   
    }else{
        await setDoc(followRef,follow);
        if(FollowCountLet ){
            updatedFollowCount= FollowCountLet +1
            
        }else{
            updatedFollowCount=1
            
        }




        





       

        
        await updateDoc(UserRef,{
            FollowCount:updatedFollowCount /* || 0 + 1 */
            })

           

      
    } 


    if(Follow){
    
      if(UserFollowWho ){
          
           updatedFollowCountWho = UserFollowWho -1 
      }else{
         
         updatedFollowCountWho = 0 
      }
  
  
       
  
      await updateDoc(UserWhoFollow,{
        FollowWhoCount:updatedFollowCountWho /* - 1 */
        })
  
  
      
      
  
      
  
     
      }else{
          
          if(UserFollowWho ){
             
              updatedFollowCountWho = UserFollowWho + 1
          }else{
             
              updatedFollowCountWho =1
          }
  
  
  
  
          
  
  
  
  
  
          await updateDoc(UserWhoFollow,{
            FollowWhoCount:updatedFollowCountWho /* - 1 */
            })
  
          
         
  
             
  
        
      }
/* console.log(FollowCountWholet)

    let updatedFollowCountWho 
    if(FollowCountWholet  ){
            
         updatedFollowCountWho = FollowCountWholet + 1 
        }/* else{
           
            updatedFollowCountWho =FollowCountWholet - 1
        }  */ 
      /*   console.log(FollowWho) */
      /* console.log(UserFollowWho)  */
        
    
  
} catch (error) {
  console.error
}finally {
  setDisabled(false)
}



   
  
  
   }

/* console.log(user.FollowWhoCount) */

 

useEffect(()=>{
 

  if(UserView){
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


  /*  */
  }

   if(UserView ){
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
  }
 

 
  
  








  const usersCollectionWho = collection(db, 'users');
  const quserwho = query(usersCollectionWho,where('id','==' ,auth.currentUser.uid));
  onSnapshot(quserwho, (snapshot) => {
    const userswho = snapshot.docs.map((doc) => doc.data());
    setUserFollowWho(userswho)
  })
    



 

},[])




  





 













 return( <div>


 <div>








 { DataOtherUser.map((data)=>(




<div className="bg-[#1B4DFF] flex p-7 m-5 rounded-[8px] shadow-md">
 <div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden '>
  <img src={data.imageProfile} />
  </div>
<div className="ml-5">
<div className="flex flex-col">
<div >
<button onClick={handleFollow} className={!Follow ? 'w-[90px] bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]' :'w-[120px] bg-white py-2 px-6 text-black active:scale-95  border-red transform transition disabled:bg-[#98b2c3] '} disabled={disabledFollow}>{!Follow ? 'Seguir' : 'No Seguir'} </button>

  </div>
<p>{data.username}</p>
</div>




<div className="flex ">
<h2>{data.FollowCount ? data.FollowCount:"0" } seguidores</h2>
<h2 className="ml-3 ">{data.FollowWhoCount ? data.FollowWhoCount : "0"} seguidos</h2>

</div>

</div>
    

    




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