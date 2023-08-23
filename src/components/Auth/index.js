

import  { useContext, useEffect, useMemo, useState } from 'react'
import Lottie from 'react-lottie-player'
import AuthAnimation from '../../../public/assets/animations/auth-page-animation.json' 
/* import img from 'public/Cat03.jpg' */
import useForm from '../../hooks/useForm'
import{AiFillCamera, AiFillFacebook} from 'react-icons/ai'
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
/* import ImageDefault from '' */
/* import ImageDefault from '../public/PhotoDefault.png' */

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

  

  try{




    const PhotoProfileName =  `PhotoProfile/${FileProfile.name}`

    const storageRef = ref(storage,PhotoProfileName) 
    
    
    const uploadTaskprofile = await uploadBytes(storageRef,FileProfile )
    
    const url = await getDownloadURL(uploadTaskprofile.ref) 




const userCollection = collection(db,'users');

const userQuery = query(userCollection,where('username','==', onboardingForm.username))


const usersSnapshot= await getDocs(userQuery)


if(usersSnapshot.docs.length > 0){
   toast.error('El nombre de usuario ya existe')
   return
}
const imageUrlDefault ='https://firebasestorage.googleapis.com/v0/b/instagram-clone-app-898ee.appspot.com/o/PhotoDefault.png?alt=media&token=f54b9879-8d70-4f0c-86a9-576dcc0fd18c'

await setDoc(doc(db,'users',auth.currentUser.email),{

fullName:onboardingForm.fullName ,
username:onboardingForm.username, 
email:auth.currentUser.email,
id:auth.currentUser.uid,
 imageProfile:!FileProfile ? 'https://firebasestorage.googleapis.com/v0/b/instagram-clone-app-898ee.appspot.com/o/PhotoDefault.png?alt=media&token=4a55416f-27c7-4c0e-a3b2-1c918ee312a3' :url ,
createdAt:serverTimestamp()


  
})

const userData = await fetchUser()

if(userData){

dispatch({
  type:'SET_USER',
  payload:{
    user:userData
  }
})

}



toast.success('Bienvenido a T-Follow!,Hecho con ❤️')
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
  return toast.error('algo no funciona')



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
    


    <div className='w-screen h-[105vh] flex items-center justify-center'>
    <div><Toaster/></div>
  <div className='flex h-4/5 w-4/5'>
  <div className='flex flex-col w-full h-full hidden lg:block'>
{/* <Lottie play loop animationData={AuthAnimation} className='w-full h-full'/> */}

<img  src='https://firebasestorage.googleapis.com/v0/b/instagram-clone-app-898ee.appspot.com/o/IconoPrincipal.svg?alt=media&token=80077db2-837f-473e-aa16-a5cfd5bd05d3'    />

<div className=''>
<h1 className='text-6xl text-white  '>T-Follow!</h1>
</div>

<div>
<h2 className='text-4xl text-white'>Registrate y Entra a esta App!</h2>
</div>
  </div>





<div className='w-full  flex flex-col bg-[#1B4DFF] p-10 rounded-md'>

<div className='relative flex flex-col w-full h-full   bg-[#1B4DFF]  '>
{isLoading && <LoadingOverlay/>}


{ !isAuthenticated &&
  
  
  <form  onSubmit={submitHandler} className='flex flex-col items-center space-y-4'>
     {/*  <div className='tracking-wider text-5x1 my-5'>Instagram</div> */}
     <div className='flex flex-col  items-center'>
     <img className='w-[180px] h-[180px]' src='https://firebasestorage.googleapis.com/v0/b/instagram-clone-app-898ee.appspot.com/o/IconoPrincipal.svg?alt=media&token=80077db2-837f-473e-aa16-a5cfd5bd05d3'    />
     <h1 className='text-4xl text-white'> T-follow!</h1>
     </div>
    

     <input type="email" name="email" id="email" onChange={onChangeHandler} value={form.email}
     className='bg-[#5C80FF]      py-2 px-3 outline-none w-full rounded-sm focus:border-gray-400' placeholder='Email' />
      <input type='password' name='password' id='password' onChange={onChangeHandler} value={form.password} placeholder='Contraseña' className='bg-gray-100 hover:bg-transparent focus:bg-transparent border   py-2 px-3 outline-none w-full'/>
      
      <button disabled={isDisabled} type='submit' className='w-full bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]'>{IsLoginForm ? 'Ingresar' : 'Registrarse'}</button>
    </form>}





    {isAuthenticated && !isOnboarded && 
    
   
  
 
    






  
    
    
    
    
        <form  onSubmit={onboardingSubmitHandler} className='flex flex-col items-center space-y-4'>


{  !FileProfile ? <label>
    <div className='flex flex-col justify-center'>
       <div className=' ml-6 relative desvanecer w-[150px] h-[150px] bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-4 border gray-500 '>
        <div className='desva absolute w-full bg-black bg-opacity-50 items-center'>
       <AiFillCamera className='w-[40px] h-[800px] text-white ml-[55px]'/>
      </div>
      <img  src='https://firebasestorage.googleapis.com/v0/b/instagram-clone-app-898ee.appspot.com/o/PhotoDefault.png?alt=media&token=f54b9879-8d70-4f0c-86a9-576dcc0fd18c' />
      
      </div> 
    
      <h1 className=' text-white text-2xl my-2'>Agrega Foto de Perfil</h1>
      </div>
    
    
    <input onChange={(e)=>setFileProfile(e.target.files[0])} 
                     type='file'
                      name='post'
                       id='post'
                        className="hidden "
                         multiple={false} 
                        />
    
    </label> : 
    <div className='flex flex-col justify-center'>
      <div className='py-2'>
    <div className='w-[150px] h-[150px] bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-4 border gray-900 ml-6  '>
    <input disabled={true} type="image" src={MediaProfile.src} className="w-full h-full" /> 
    
      </div>
      </div>

      <div className='bg-black p-2 rounded'>
        <label>
     
    
     <h1 className=' text-white text'>Agrega otra Foto de Perfil</h1>
     
   
   
   <input onChange={(e)=>setFileProfile(e.target.files[0])} 
                    type='file'
                     name='post'
                      id='post'
                       className="hidden "
                        multiple={false} 
                       />
   
   </label>
      </div>
      </div>
      }















 

  
 
     
     

     <input type="username" name="username" id="username" onChange={onboardingFormOnChangeHandler} value={onboardingForm.username}
     className='bg-gray-100 hover:bg-transparent focus:bg-transparent border       py-2 px-3 outline-none w-full rounded-sm focus:border-gray-400' placeholder='Nombre de usuario' />



      <input type='fullName' name='fullName' id='fullName' onChange={onboardingFormOnChangeHandler} value={onboardingForm.fullName} placeholder='Nombre completo' className='bg-gray-100 hover:bg-transparent focus:bg-transparent border   py-2 px-3 outline-none w-full'/>
      
      <button disabled={!onboardingForm.username || !onboardingForm.fullName} type='submit' className='w-full bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]'>Ingresar</button>
    </form>
    
    
    
    
    
    }





    <div className='w-full  flex flex-col  text-sm  text-center text-white'>
   {IsLoginForm ? 'No tienes una cuenta?' : 'Ya tienes una cuenta!'}
  <button onClick={()=>setIsLoginForm((prev)=>(!prev))}className='text-blue-900 inline-block'>{IsLoginForm ? 'Registrate' : 'Ingresa'}</button>
</div>






<div className='w-full flex items-center justify-center my-5 space-x-5'>






</div>















</div>







  </div>
  
  
  </div>
  
  
  </div>)
}

export default Auth
