import { GlobalDispatchContext, GlobalUserViewContext } from '@/state/context/GlobalContext'
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
const HeaderIcon = ({Icon,name})=>{

    const dispatch = useContext(GlobalDispatchContext)
    const router = useRouter()
     const{setUserview,setProfile,setProfileView}=useContext(GlobalUserViewContext)
const handleClickIcon =()=>{
   

if(name === 'Add'){
    dispatch({
        type:'SET_IS_UPLOAD_POST_MODAL_OPEN',
        payload:{
            isUploadPostModalOpen:true
        }
    })
}

if(name === 'Person'){
    setProfile(true)
    setProfileView(false)
}

if(name === 'Home'){
    setProfile(false)
    setProfileView(false)
}




if(name ==='Likes'){
    dispatch({
        type:'SET_IS_MODAL_NOTIFICATION',
        payload:{
            NotificationModalOpen:true
        }
    })
}

   

}

    return(
         <div onClick={handleClickIcon} className='text-black hover:bg-black transition rounded cursor-pointer p-2 hover:text-white '>
        <Icon className='' size={25}/>
        </div>
    )
}

export default HeaderIcon
