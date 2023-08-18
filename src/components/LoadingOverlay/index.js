import React from 'react'
import { BiLoaderCircle } from 'react-icons/bi'

const LoadingOverlay = () =>{

return (
    <div className='absolute flex items-center justify-center w-full h-full bg-black bg-opacity-10 blur '>
<BiLoaderCircle size={50} className='animate-spin blur-0'/>

</div>
)


}

export default LoadingOverlay
