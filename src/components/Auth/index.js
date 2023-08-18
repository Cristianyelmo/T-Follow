

import  { useContext, useEffect, useMemo, useState } from 'react'
import Lottie from 'react-lottie-player'
import AuthAnimation from '../../../public/assets/animations/auth-page-animation.json' 
/* import img from 'public/Cat03.jpg' */
import useForm from '../../hooks/useForm'
import{AiFillFacebook} from 'react-icons/ai'
import {
  GlobalContext,
  GlobalDispatchContext,
} from '../../state/context/GlobalContext';
import {BiLoaderCircle} from 'react-icons/bi'
/* const FORM_TYPES ={
  SIGNUP:true,
  LOGIN:false
}
 */



import {signInWithEmailAndPassword,createUserWithEmailAndPassword} from 'firebase/auth'
import {auth, db, storage } from '../../lib/firebase'

import {handlePromise} from '../../utils/handlePromise'
import LoadingOverlay from '../LoadingOverlay'
import { Toaster, toast } from 'react-hot-toast'
import {collection, doc,getDoc, getDocs, query, serverTimestamp, setDoc, where} from 'firebase/firestore'
import useFetchCurrentUser from '../../utils/fetchCurrentUser'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const Auth = ()=>{

  
 const [IsLoginForm,setIsLoginForm]=useState(false) 

 
 

const {isAuthenticated,isOnboarded,isLoading} = useContext(GlobalContext)


 const {fetchUser} =useFetchCurrentUser() 


const dispatch = useContext(GlobalDispatchContext);
 







const{form,onChangeHandler,resetForm}=useForm({
  email:'',
  password:''
})


const {form:onboardingForm,onChangeHandler:onboardingFormOnChangeHandler} = 
useForm({
  username: '',
  fullName:''
})



const authenticate = async () =>{
  let error = null
  if(IsLoginForm){
const [data,loginError] =   await handlePromise(signInWithEmailAndPassword(auth,form.email,form.password))

error=loginError
console.log(data)

  }else{
    const [data,signupError] = await handlePromise(createUserWithEmailAndPassword(auth,form.email,form.password))

    error=signupError
    console.log(data)
  }



  {error ? toast.error(error.message):toast.success(`you have successfully ${IsLoginForm ? 'logged in': 'signed up'}`)}
/*   {!error && } */


}



 /*  const fetchUser = async ()=>{

if(!isAuthenticated) return;

    const currentUserRef = doc(db,'users',auth.currentUser.email)
    const currentUserSnap = await handlePromise(getDoc(currentUserRef))
    
    if(docSnap.exists()){
    
      dispatch({
        type: 'SET_USER',
        payload:{
          user:currentUserSnap.data()
        }
        
      })
     
      dispatch({
        type: 'SET_IS_ONBOARDED',
        payload:{
          isOnboarded: true
        }
        
      })
    
    
    
    }else{
      toast('please complete onboarding')
    }
    
    
    
    
    } */
const [FileProfile,setFileProfile] = useState('')
const[MediaProfile,setMediaProfile] = useState({
  src:''
})

const setUserData = async()=>{

  const PhotoProfileName =  `PhotoProfile/${FileProfile.name}`

const storageRef = ref(storage,PhotoProfileName) 


const uploadTaskprofile = await uploadBytes(storageRef,FileProfile )

const url = await getDownloadURL(uploadTaskprofile.ref) 

  try{









const userCollection = collection(db,'users');

const userQuery = query(userCollection,where('username','==', onboardingForm.username))


const usersSnapshot= await getDocs(userQuery)


if(usersSnapshot.docs.length > 0){
   toast.error('username already exists')
   return
}


await setDoc(doc(db,'users',auth.currentUser.email),{

fullName:onboardingForm.fullName,
username:onboardingForm.username,
email:auth.currentUser.email,
id:auth.currentUser.uid,
 imageProfile:url ? url : 'boeenas', 
createdAt:serverTimestamp()


  
})

toast.success('welcome to instagram clone by Cris')


dispatch({
  type:'SET_IS_ONBOARDED',
  payload:{
    isOnboarded:true

    
  }
})




  }catch(error){
console.log(error)
  }
}

  






const submitHandler = async (e) => {
  e.preventDefault();
  dispatch({
    type: 'SET_LOADING',
    payload:{
      isLoading: true
    }
    
  })


await authenticate()
/* await fetchUser() */
const userData = await fetchUser()

if(userData){

dispatch({
  type:'SET_USER',
  payload:{
    user:userData
  }
})


dispatch({
  type:'SET_IS_ONBOARDED',
  payload:{
    isOnboarded: true,
  }
})










}




  let error = null;
  dispatch({
    type: 'SET_LOADING',
    payload:{
      isLoading: false
    }
    
  });
 

 /*  if (error) toast.error(error.message);
  if (!error)
    toast.success(
      `you have successfully ${IsLoginForm ? 'logged in' : 'signed up'}`
    ); */
  resetForm();
};


const isDisabled = useMemo(()=>{
  return !Object.values(form).every((val)=>!!val)
  
},[form])



const onboardingSubmitHandler = async (e) =>{
e.preventDefault()
dispatch({
  type: 'SET_LOADING',
  payload:{
    isLoading: true
  }
  
});

await setUserData()

 dispatch({
    type: 'SET_LOADING',
    payload:{
      isLoading: false
    }
    
  });


}


console.log(FileProfile)


useEffect(()=>{
  const reader = new FileReader()


const handleEvent = (e)=>{

  switch(e.type){
case 'load':
 
  return setMediaProfile((prev)=>({
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


if(FileProfile){
  reader.addEventListener('load',handleEvent)
  reader.addEventListener('error',handleEvent)
  reader.readAsDataURL(FileProfile)
}

return ()=>{
  reader.removeEventListener('load',handleEvent)
  reader.removeEventListener('error',handleEvent)
}


},[FileProfile])



  return (
    


    <div className='w-screen h-screen flex items-center justify-center'>
    <div><Toaster/></div>
  <div className='flex h-4/5 w-4/5'>
  <div className='w-full h-full '>
<Lottie play loop animationData={AuthAnimation} className='w-full h-full'/>




  </div>





<div className='w-full bg-white border flex flex-col border-gray-300 p-10'>

<div className='relative flex flex-col w-full h-full p-18 space-y-5 bg-white border border-gray-300'>
{isLoading && <LoadingOverlay/>}


{ !isAuthenticated &&
  
  
  <form  onSubmit={submitHandler} className='flex flex-col items-center space-y-4'>
      <div className='tracking-wider text-5x1 my-5'>Instagram</div>
     <input type="email" name="email" id="email" onChange={onChangeHandler} value={form.email}
     className='bg-gray-100 hover:bg-transparent focus:bg-transparent border       py-2 px-3 outline-none w-full rounded-sm focus:border-gray-400' placeholder='Email' />
      <input type='password' name='password' id='password' onChange={onChangeHandler} value={form.password} placeholder='Password' className='bg-gray-100 hover:bg-transparent focus:bg-transparent border   py-2 px-3 outline-none w-full'/>
      
      <button disabled={isDisabled} type='submit' className='w-full bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]'>{IsLoginForm ? 'Log In' : 'Sign up'}</button>
    </form>}





    {isAuthenticated && !isOnboarded &&     <form  onSubmit={onboardingSubmitHandler} className='flex flex-col items-center space-y-4'>
      <div className='tracking-wider text-5x1 my-5'>Instagram</div>


 

{!FileProfile ?<label>

  <div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden '>
  <img src='/xd.png' />
  </div>



<input onChange={(e)=>setFileProfile(e.target.files[0])} 
                 type='file'
                  name='post'
                   id='post'
                    className="hidden "
                     multiple={false} 
                    />

</label> : 
<div className='w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden '>
<input type="image" src={MediaProfile.src} className="w-full h-full" /> 
  </div>}
    
 
     
     

     <input type="username" name="username" id="username" onChange={onboardingFormOnChangeHandler} value={onboardingForm.username}
     className='bg-gray-100 hover:bg-transparent focus:bg-transparent border       py-2 px-3 outline-none w-full rounded-sm focus:border-gray-400' placeholder='username' />



      <input type='fullName' name='fullName' id='fullName' onChange={onboardingFormOnChangeHandler} value={onboardingForm.fullName} placeholder='Your fullname' className='bg-gray-100 hover:bg-transparent focus:bg-transparent border   py-2 px-3 outline-none w-full'/>
      
      <button disabled={!onboardingForm.username || !onboardingForm.fullName} type='submit' className='w-full bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]'>Submit</button>
    </form>}











<div className='w-full flex items-center justify-center my-5 space-x-5'>

<div className='h-1 w-full bg-slate-400'></div>
<div className='text-gray-400 font-semibold text-center text-sm'>Or</div>
<div className='h-1 w-full bg-slate-400'></div>



</div>

<div className='w-full text-indigo-900 flex items-center justify-center'>
<AiFillFacebook className='inline-block text-2x1 mr-2  space-x-2'/>
<span className='font-semibold text-sm'>Log in with Facebook</span>
</div>

{IsLoginForm  && <div className='w-full text-center text-indigo-900'>Forgotten you password?</div>}








</div>

<div className='w-full bg-white border flex flex-col border-gray-300 text-sm py-5 text-center'>
   {IsLoginForm ? 'Dont have an account?' : 'Already have an account!'}
  <button onClick={()=>setIsLoginForm((prev)=>(!prev))}className='text-blue-900 inline-block'>{IsLoginForm ? 'Log In' : 'Sign up'}</button>
</div>




  </div>
  
  </div>
  
  
  </div>)
}

export default Auth
