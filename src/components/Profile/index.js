/* import Header from "@/components/Header" */
import { auth, db } from "@/lib/firebase"
import { GlobalContext } from "../../state/context/GlobalContext"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"

const ProfileComponent = ()=>{

const {user}=useContext(GlobalContext)

const[postsProfile,setpostsProfile]=useState([])


useEffect(()=>{
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection);
  onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => doc.data());
    setpostsProfile(posts)
  })

},[])


  












 return( <div>
{/*  <Header/> */}

 <div>
<p>  {user.username}   </p>
<p>{user.fullName}
</p>
<p>{user.FollowCount}</p>
<div>

{
                postsProfile.map((post)=>(

                  post.username === user.username &&
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
export default ProfileComponent