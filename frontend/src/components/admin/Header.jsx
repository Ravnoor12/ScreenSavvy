import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsSunFill } from 'react-icons/bs';
import { useTheme } from '../../hooks';
import AppSearchForm from '../form/AppSearchForm';
import { useNavigate } from 'react-router-dom';

export default function Header({onAddActorClick,onAddMovieClick}) {
  const [showOptions,setshowOptions] = useState(false);
  const {toggleTheme} = useTheme();
  const navigate = useNavigate()
  const options = [
    {title: 'Add Movie', onclick:onAddMovieClick},
    {title: 'Add Actor',onclick:onAddActorClick},
  ];

  const handleSearchSubmit = (query)=>{
    console.log(query);
    if(!query.trim()) return;
    navigate('/search?title=' + query);
  }

  return (
    <div className='flex items-center justify-between relative p-5'>
      <AppSearchForm onSubmit={handleSearchSubmit} placeholder='Search Movies'/>
        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className='dark:text-white text-light-subtle'>
          <BsSunFill size = {24} />
          </button>

          <button onClick={()=> setshowOptions(true)} className='flex items-center space-x-2
           dark:border-dark-subtle border-light-subtle 
            dark:text-dark-subtle text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1'>
            <span>Create</span>
            <AiOutlinePlus></AiOutlinePlus>
          </button>
          <CreateOptions visible={showOptions} options={options} onClose={()=>setshowOptions(false)}/>
        </div>
    </div>
  )
}

const CreateOptions = ({options,visible,onClose})=>{
  // all the extra things below are for smooth animation of dropdown options
  const container = useRef();
  const containerID = "options-container"
  useEffect(()=>{
    const handleClose = (e)=>{
      // console.log(container.current);
      if(!visible) return;
      const { parentElement, id } = e.target;
      if (parentElement.id === containerID || id === containerID) return;
   
      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    }
    document.addEventListener('click',handleClose);
    return ()=> {document.removeEventListener('click',handleClose);}
  },[visible]);

  const handleClick = (func)=>{
    func();
    onClose();
  }

  if(!visible) return null;
  return <div ref={container} id={containerID} className='absolute right-0 top-12 z-50 flex flex-col space-y-3 p-5
            dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale'
            onAnimationEnd={(e)=>{
              if(e.target.classList.contains("animate-scale-reverse")) onClose();
              e.target.classList.remove("animate-scale");
            }}
            >
            {options.map(({title,onclick})=>{  // destructuring title and onClick from options object
                return <Option key={title} onclick={()=> handleClick(onclick)}>{title}</Option>
            })}
          {/* <Option onClick={onclose}>Add movie</Option>
          <Option onClick={onclose}>Add actor</Option> */}
        </div>
}  

const Option = ({children,onclick})=>{
  return (
    <button onClick={onclick} className='dark:text-white text-secondary 
          hover:opacity-80 transition'>{children}
    </button>
    )
}