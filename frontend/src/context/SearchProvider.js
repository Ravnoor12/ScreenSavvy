import React, {createContext, useState} from 'react'
import { useNotification } from '../hooks';

export const SearchContext = createContext();

let timeoutId;
const debounce = (func,delay)=>{
  return (...args)=>{
    if(timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null,args);
      }, delay);
  }
}

export default function SearchProvider({children,}) {
    const {updateNotification} = useNotification;
    const [searching,setSearching] = useState(false);
    const [results,setResults] = useState([]);
    const [resultNotFound,setRsultNotFound] = useState(false);

    const  search = async(method,query,updateFun)=>{
        const {error,results} = await method(query);
        if(error) return updateNotification('error',error);
        if(!results.length){
            setResults([]);
            updateFun && updateFun([]);
            return setRsultNotFound(true);
        }
        setRsultNotFound(false);
        setResults(results);
        updateFun && updateFun([...results]);
    }

    const debounceFunc = debounce(search,300);

    const handleSearch = (method,query,updateFun)=>{
        setSearching(true);
        if(!query.trim()) {
            updateFun && updateFun([])
            return resetSearch();
        }
        debounceFunc(method,query,updateFun)
    }

    const resetSearch = ()=> {
        setSearching(false);
        setResults([]);
        setRsultNotFound(false);
    }

  return (
    <SearchContext.Provider value={{handleSearch,resetSearch,searching,resultNotFound,results}}>
        {children}
    </SearchContext.Provider>
  )
}
