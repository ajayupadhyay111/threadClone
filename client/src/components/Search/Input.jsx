import React from 'react'
import { LuSearch } from "react-icons/lu";

const Input = ({inputValue,setInputValue}) => {
  return (
    <div className='p-3 mx-4 mt-4 flex items-center gap-2 bg-gray-100/50 dark:bg-black/80 dark:border-neutral-600 border rounded-2xl border-gray-300'>
        <LuSearch className='text-gray-300' size={20}/>
        <input type="text" placeholder='Search' value={inputValue} onChange={(e)=>setInputValue(e)} className='outline-none border-none w-full' />
    </div>
  )
}

export default Input