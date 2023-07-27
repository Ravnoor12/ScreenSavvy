import React, { useState } from 'react'
import LiveSearch from './LiveSearch'
import { renderItem } from '../utils/helper'
import { useSearch } from '../hooks';
import { SearchActor } from '../api/actor';

export default function WriterSelector({onSelect}) {
    const [value,setValue] = useState("");
    const [profiles,setProfiles] = useState([]);
    const {handleSearch,resetSearch} = useSearch();

    const handleOnChange = ({target})=>{
        const {value} = target;
        setValue(value);
        handleSearch(SearchActor,value,setProfiles);
    }

    const handleOnSelect = (profile)=>{
        setValue('');
        onSelect(profile);
        setProfiles([]);
        resetSearch();
    }
  return (
    <LiveSearch name='writers' placeholder='Search Profile'
        results={profiles} renderItem={renderItem}
        onSelect={handleOnSelect} onChange={handleOnChange}
    value={value} />
  )
}
