import React, { useState } from 'react'
import {AiOutlineClose} from 'react-icons/ai'

const defaultInputStyle = 'dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white text-lg'
export default function AppSearchForm({showResetIcon,placeholder,onSubmit,onReset,inputClassName=defaultInputStyle}) {
  const [value,setValue] = useState('');

  const handleOnSubmit = (e)=>{
    e.preventDefault();
    onSubmit(value);
  } 

  const handleReset = ()=>{
    setValue('');
    onReset();
  }

  return (
    <form onSubmit={handleOnSubmit} className='relative'> 
      <input type="text" 
      className={
        'border-2 bg-transparent transition rounded p-1 outline-none' + inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={({target})=>setValue(target.value)} />
    {showResetIcon ? ( <button type='button' onClick={handleReset}
    className='absolute top-1/2 -translate-y-1/2 right-2 text-secondary dark:text-white'>
    <AiOutlineClose />
    </button>) : null}
    </form>
  )
}
