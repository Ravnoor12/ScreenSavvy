import React, { useEffect, useRef, useState } from 'react'
import {AiOutlineClose} from 'react-icons/ai'

export default function TagsInput({name,value,onChange}) {
  const [tag,setTag] = useState('');
  const [tags,setTags] = useState([]);
  const input = useRef();
  const tagsInput = useRef();

  const handleOnChange = ({target})=>{
    const {value} = target;  // or e.target.value
    if(value!==",") setTag(value); 
    onChange(tags);
  }

  const handeKeyDown = ({key})=>{
    console.log(key); //getting all the input characters including enter as well bcoz default behaviour is prevented in movieForm
    if(key===',' || key==='Enter'){
      if(!tag) return ;
      if(tags.includes(tag)) return setTag(''); // if same tag in written again then it is not added and input is made empty
      setTags([...tags,tag]);
      setTag('');
    }
    if(key=== "Backspace" && !tag && tags.length){ // remove a tag onlyif there is tag and there is no other text in input
      //console.log("its delete")
      const newTags = tags.filter((_,index)=> index !== tags.length-1);
      setTags([...newTags]);
    }
  }

  const removeTag = (tagToRemove)=>{
    const newTags = tags.filter((tag)=> tag!==tagToRemove);
      setTags([...newTags]);
    //console.log("remove tag called");
  }

  const handleOnFocus = ()=>{
    tagsInput.current.classList.remove('dark:border-dark-subtle','border-light-subtle')
    tagsInput.current.classList.add('dark:border-white','border-primary')
  }

  const handleOnBlur = ()=>{
    tagsInput.current.classList.add('dark:border-dark-subtle','border-light-subtle')
    tagsInput.current.classList.remove('dark:border-white','border-primary')
  }

  useEffect(()=>{
    if(value.length) setTags(value);
  },[value]);

  useEffect(()=>{
    onChange(tags)
  },[tags])

  useEffect(()=>{
    input.current?.scrollIntoView(false); //false is for top vertical alignment(read from mdn docs)
  },[tag]);

  return (
    <div>
        <div ref={tagsInput}
        onKeyDown={handeKeyDown} className='border-2 bg-transparent dark:border-dark-subtle border-light-subtle
           px-2 h-10 rounded w-full dark:text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition'>
            {tags.map(t =><Tag onClick={()=>removeTag(t)} key={t}>{t}</Tag>)}
            <input ref={input} id = {name}
            type="text" className='h-full flex-grow bg-transparent outline-none dark:text-white'
             placeholder='tag one, tag two'
             value={tag} onChange={handleOnChange}
             onFocus={handleOnFocus}
             onBlur={handleOnBlur}
             />
        </div>
    </div>
  )
}


const Tag = ({children,onClick})=>{
  return (
    <span className='dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap'>
              {children}
              <button type='button' onClick={onClick}> 
              {/* if button type is not set to button then it is consider as submit and form gets submit */}
                <AiOutlineClose size={12}/>
              </button>
    </span>
  )
}