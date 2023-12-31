import Link from 'next/link'
import React from 'react'
import { BsSearch } from 'react-icons/bs'
import HeaderIcon from './HeaderIcon'


import {
Add,
Cross,
Home,
Heart,


Compass,
Person
} from '../Header/HeaderIcons'

import {signOut} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const Header_items =[
    {
        icon:Home,
        url: '/',
        name: 'Home'
        },
            {
                icon:Add,
                url: '/',
                name: 'Add'
                }
                    ,
                {
                    icon:Heart,
                    url: '/',
                    name: 'Likes'
                    },
                     {
                    icon:Person,
                    url: '/',
                    name: 'Person'
                    }
                    
]


const Header = ()=>{

const handleLogout  = async ()=>{
   await signOut(auth)
   window.location.reload()
}



    return(
        <header className='w-full flex items-center justify-between bg-[#1B4DFF] shadow-2x1 shawdow-md'>


        <div className='photo-letra flex justify-around items-center ml-3'>
        <div className='text-x1 font-semibold tracking-wider mr-4'>
            <img src='https://firebasestorage.googleapis.com/v0/b/instagram-clone-app-898ee.appspot.com/o/IconoPrincipal.svg?alt=media&token=80077db2-837f-473e-aa16-a5cfd5bd05d3' className='w-[100px] h-[100px] iconoPrincipal'/>
        </div>
        <div className='flex justify-center mb-[12px]'>
            <p className='text-white mt-[20px] text-xl'>T-follow</p>
        </div>

        </div>
        
       
                    
        
        
        
        
        
        
        
                    
                    <div className='icons-logout flex space-x-2 Iconos mr-4'>
        
                        <div className='flex space-x-4'>
                        {
        
        Header_items.map((item)=>(
            <HeaderIcon Icon={item.icon} name={item.name} key={item.name}/>
        ))
        
        
        
                        }
                     
                        </div>
                        <button onClick={handleLogout} className='py-2 h-4/5 bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]'>Salir</button>
                    </div>
        
                </header>
    )
}

export default Header
