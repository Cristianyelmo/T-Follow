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
        <header className='w-full flex items-center justify-around h-16 bg-[#1B4DFF] shadow-2x1 shawdow-md'>


        <Link href='/'>
        <div className='text-x1 font-semibold tracking-wider'>
            <img src='/IconoPrincipal.svg' className='w-[50px] h-[50px]'/>
        </div>
        
        </Link>
                    
        
        
        
        
        
        
        
                    <div className='flex bg-gray-100 items-center space-x-4 focus:border-gray-400 rounded-lg px-2 group-focus:border-gray-400 px-2 group'>
                     
        
                    </div>
                    <div className='flex space-x-2'>
        
                        <div className='flex space-x-4'>
                        {
        
        Header_items.map((item)=>(
            <HeaderIcon Icon={item.icon} name={item.name} key={item.name}/>
        ))
        
        
        
                        }
                     
                        </div>
                        <button onClick={handleLogout} className='py-2 h-4/5 bg-[#0095F6] py-2 px-6 text-white active:scale-95 transform transition disabled:bg-[#98b2c3]'>Logout</button>
                    </div>
        
                </header>
    )
}

export default Header
