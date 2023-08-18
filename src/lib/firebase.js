import {getFirestore, getfiresstore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { getStorage} from 'firebase/storage'
import {getApp, getApps, initializeApp} from 'firebase/app'
const firebaseConfig ={
    apiKey: "AIzaSyDPc-fVkcRch2iJTL25EML_wnlxeaD79WY",
  authDomain: "instagram-clone-app-898ee.firebaseapp.com",
  projectId: "instagram-clone-app-898ee",
  storageBucket: "instagram-clone-app-898ee.appspot.com",
  messagingSenderId: "330706539271",
  appId: "1:330706539271:web:ad988e455da2927c40aba2"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth(app)
const storage = getStorage()

export {
    app,
    db,
    auth,
    storage
}