import { auth, db } from "@/lib/firebase"
/* import { GlobalContext } from "@/state/context/GlobalContext" */
import { doc, getDoc } from "firebase/firestore"
import { useEffect } from "react"
/* import { useContext } from "react" */
import { toast } from "react-hot-toast"
/* import { handlePromise } from "./handlePromise" */

const useFetchCurrentUser = ()=>{





  const fetchUser = async ()=>{

  if(!auth?.currentUser?.email)return;
    
        const currentUserRef = doc(db,'users',auth.currentUser.email)
        const currentUserSnap = await getDoc(currentUserRef)
        
        if(currentUserSnap.exists()){
       
         return currentUserSnap.data()
        
        
        }else{
          return null
        }
        
        
        
        
        }

    return {fetchUser}
 
}

export default useFetchCurrentUser 






