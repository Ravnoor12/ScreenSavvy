import React from 'react'

export default function NextandPrevButton({className='',OnPrevClick,OnNextClick}) {
    const getClasses = ()=>{
        return "flex justify-end items-center space-x-3 ";
    }

  return (
    <div className={getClasses() + className}>
        <Button onClick={OnPrevClick} title='Prev'/>
        <Button onClick={OnNextClick} title='Next'/>
      </div>
  )
}

const Button = ({title,onClick})=>{
    return (
        <button type='button' onClick={onClick} 
            className='text-primary dark:text-white hover:underline'>
          {title}
        </button>
    )
}