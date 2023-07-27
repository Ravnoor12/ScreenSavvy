import React, { useState } from 'react'
import { useNotification, useSearch } from '../../hooks';
import { commonInputClasses } from '../../utils/theme';
import LiveSearch from '../LiveSearch';
import { renderItem } from '../../utils/helper';
import { SearchActor } from '../../api/actor';

// const cast = [{actor:id,roleAs:'',leadActor:true}];
const defaultCastInfo = {
  profile: {},
  roleAs: '',
  leadActor: false
}

export default function CastForm({onSubmit}) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const [profiles,setProfiles] = useState([]);
  const {updateNotification} = useNotification();
  const {handleSearch,resetSearch} = useSearch();

  const handleOnChange = ({target})=>{
    const {checked,name,value} = target;
    if(name==='leadActor') return setCastInfo({...defaultCastInfo,leadActor:checked});
    setCastInfo({...castInfo,[name]:value})  //handling change for roleas
  };

  const handleProfileSelect = (profile)=>{
    setCastInfo({...castInfo,profile:profile})  //handling change for roleas
  }

  const handleSubmit = ()=>{
    const { profile, roleAs } = castInfo;
    if(!profile.name) return updateNotification('error','Cast profile is missing!');
    if(!roleAs.trim()) return updateNotification('error','Cast profile is missing!');
    onSubmit(castInfo);
    console.log(castInfo);
    setCastInfo({...defaultCastInfo,profile:{name: ""}})
    resetSearch();
    setProfiles([]);
    
  }

  const handleProfileChange = ({target})=>{
    const {value } = target;
    const {profile} = castInfo;
    profile.name = value;
    setCastInfo({...castInfo,...profile})
    handleSearch(SearchActor,value,setProfiles)   
  }

  const { leadActor, profile, roleAs } = castInfo;
  return (
    <div className='flex items-center space-x-2'>
      <input type="checkbox" name='leadActor' className='w-4 h-4' title='Set as lead actor' checked={leadActor} onChange={handleOnChange} />
      <LiveSearch placeholder='Search profile' value={profile.name} onChange={handleProfileChange}
       results={profiles} onSelect={handleProfileSelect} renderItem={renderItem}/>
      <span className='dark:text-dark-subtle text-light-subtle font-semibold'>
        as
      </span>
      <div className="flex-grow">
        <input type="text" className={commonInputClasses + " rounded p-1 text-lg border-2"}
          placeholder='Role as' value={roleAs} name='roleAs' onChange={handleOnChange}/>
      </div>
      <button type='button' onClick={handleSubmit} className='dark:bg-white bg-secondary
       text-white dark:text-primary rounded px-1'>Add</button>
    </div>
  )
}
