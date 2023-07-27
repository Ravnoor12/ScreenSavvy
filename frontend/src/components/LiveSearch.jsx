import React, { forwardRef, useEffect, useRef } from 'react'
import { useState } from 'react';
import { commonInputClasses } from '../utils/theme'

// export const results = [
//   {
//     id: "1",
//     avatar:
//       "https://images.unsplash.com/photo-1643713303351-01f540054fd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "John Doe",
//   },
//   {
//     id: "2",
//     avatar:
//       "https://images.unsplash.com/photo-1643883135036-98ec2d9e50a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Chandri Anggara",
//   },
//   {
//     id: "3",
//     avatar:
//       "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Amin RK",
//   },
//   {
//     id: "4",
//     avatar:
//       "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Edward Howell",
//   },
//   {
//     id: "5",
//     avatar:
//       "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Amin RK",
//   },
//   {
//     id: "6",
//     avatar:
//       "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Edward Howell",
//   },
// ];


export default function LiveSearch(
  { value='', 
  onChange=null, 
  placeholder='', 
  results=[], 
  selectedResultStyle, 
  resultContainerStyle, 
  renderItem=null, 
  inputStyle, 
  onSelect=null ,
  name}
  ) {
  const [displaySearch, setdisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [defaultValue, setDefaultValue] = useState('');
  const handleOnFocus = () => {
    if (results.length) setdisplaySearch(true);
  }
  const closeSearch = ()=>{
    setdisplaySearch(false);
    setFocusedIndex(-1);// means on focus no result should be focused previously
  }
  const handleOnBlur = () => {
    closeSearch();
  }

  const handleSelection = (selectedItem) => {
    if(selectedItem) {
      onSelect(selectedItem);
      closeSearch();
    }
  }

  const handleKeyDown = ({ key }) => {
    console.log(key);
    let nextCount;
    const keys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
    if (!keys.includes(key)) return;
    if (key === 'ArrowDown') {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === 'ArrowUp') {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }
    if(key==='Escape') return closeSearch();
    if (key === 'Enter') return handleSelection(results[focusedIndex]);
    setFocusedIndex(nextCount);

  }

  const getInputStyle = () => {
    return inputStyle ? inputStyle : commonInputClasses + " border-2 rounded p-1 text-lg"
  }

  const handleChange = (e)=>{
    setDefaultValue(e.target.value);
    onChange && onChange(e); // checks if onchange is not null then it wont give call
  }

  useEffect(()=>{
    setDefaultValue(value);
  },[value]);

  useEffect(()=>{
    if(results.length) return setdisplaySearch(true);
    setdisplaySearch(false);
  },[results.length]);

  return (
    <div className='relative'>
      <input type="text"
        id={name}
        name={name}
        className={getInputStyle()}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        value={defaultValue}
        onChange={handleChange}
      />
      <SearchResults visible={displaySearch} results={results}
        focusedIndex={focusedIndex} onSelect={handleSelection}
        renderItem={renderItem} resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle} />
    </div>
  )
}
// const renderItem = ({id,name,avatar})=>{
//   return <div className="flex">
//     <img src={avatar} alt=''></img>
//     <p>{name}</p>
//   </div>
// }
const SearchResults = ({ visible, results = [], focusedIndex, onSelect,
  renderItem,
  resultContainerStyle, selectedResultStyle }) => {
  const resultContainer = useRef();
  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behaviour: 'smooth',
      block: 'center'
    });
  }, [focusedIndex]);
  if (!visible) return null;
  return (
    <div className='absolute z-50 right-0 left-0 top-10 bg-white dark:bg-secondary
         shadow-md p-2 max-h-64 space-y-2 overflow-auto mt-1 dark:text-white custom-scroll-bar'>
      {results.map((result, index) => {
        const getSelectedClass = () => {
          return selectedResultStyle ? selectedResultStyle : 'dark:bg-dark-subtle bg-light-subtle'
        }
        return <ResultCard ref={index === focusedIndex ? resultContainer : null}
          key={index.toString()} item={result} renderItem={renderItem}
          resultContainerStyle={resultContainerStyle}
          selectedResultStyle={index === focusedIndex ? getSelectedClass() : ""}
          onMouseDown={() => onSelect(result)}
        />
      })}
    </div>
  )
}

const ResultCard = forwardRef((props, ref) => {
  const { item, renderItem, resultContainerStyle, selectedResultStyle, onMouseDown } = props;
  const getClasses = () => {
    if (resultContainerStyle) return resultContainerStyle + " " + selectedResultStyle;
    return (selectedResultStyle +
      'cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition')
  }
  return <div ref={ref} onMouseDown={onMouseDown}
    className={getClasses()}>
    {renderItem(item)}
  </div>
})