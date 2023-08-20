import React, { createContext, useEffect, useReducer, useState } from 'react';
/* import { globalReducer } from '../reducers/globalReducer'; */
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
 import { auth } from '../../lib/firebase';
/* import useFetchCurrentUser from '@/utils/fetchCurrentUser'; */
 import useFetchCurrentUser from '../../utils/fetchCurrentUser'; 
 
const intialState = {
  user: {},
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: true,
  isUploadPostModalOpen: false,
  NotificationModalOpen: false
};

const globalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'SET_LOADING': {
      return{ ...state,
      isLoading: action.payload.isLoading,}
    }
    case 'SET_IS_AUTHENTICATED': {
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
      };
    }
    case 'SET_IS_ONBOARDED': {
      return {
        ...state,
        isOnboarded: action.payload.isOnboarded,
      };
    }
    case 'SET_IS_UPLOAD_POST_MODAL_OPEN': {
      return {
        ...state,
        isUploadPostModalOpen: action.payload.isUploadPostModalOpen,
      };
    }

    case 'SET_IS_MODAL_NOTIFICATION': {
      return {
        ...state,
        NotificationModalOpen: action.payload.NotificationModalOpen,
      };
    }



    default: {
      throw Error('unknown action: ' + action.type);
    }
  }
};

export const GlobalContext = createContext(intialState);
export const GlobalDispatchContext = createContext(null);
export const GlobalUserViewContext = createContext(null)

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, intialState);
  const { fetchUser } = useFetchCurrentUser();

/* const {fetchUser} = useFetchCurrentUser() */
const[UserView,setUserview]=useState()
const [Profile,setProfile] = useState(false)
const [ProfileView,setProfileView] = useState(false)
const[PostId,setPostId]=useState()
const[xd,setXd]=useState()
  useEffect(() => {
   
const unsubscribe = onAuthStateChanged(auth,async (user)=>{
if(user){
  dispatch({
    type:'SET_IS_AUTHENTICATED',
    payload:{
      isAuthenticated:true
    }
  })

const userData = await fetchUser()
setXd(userData)
if(userData){
dispatch({
type:'SET_USER',
payload:{
  user: userData
}


})

dispatch({
type:'SET_IS_ONBOARDED',
payload:{
  isOnboarded:true
}


})





}










  
}
dispatch({
  type: 'SET_LOADING',
  payload:{
    isLoading: false
  }
  
})



})

return ()=>unsubscribe()



    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

const contextvalue ={
  setUserview,
  UserView,
  setProfile,
  setProfileView,
  Profile,
  ProfileView,
  PostId,setPostId,
 

}





  return (
    <GlobalUserViewContext.Provider value={contextvalue}>
    <GlobalContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalContext.Provider>
    </GlobalUserViewContext.Provider>
  );
};

export default GlobalContextProvider;
