import React, { useEffect, useState } from 'react'
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { SearchActor, deleteActor, getActors } from '../../api/actor';
import { useNotification } from '../../hooks'
import NextandPrevButton from '../NextandPrevButton';
import UpdateActors from '../modals/UpdateActors';
import AppSearchForm from '../form/AppSearchForm';
import { useSearch } from '../../hooks';
import NotFoundText from '../NotFoundText';
import ConfirmModal from '../modals/ConfirmModal';

let currentPageNo=0;
const limit = 5;  
export default function Actors() {
  const [actors,setActors] = useState([]);
  const [results,setResults] = useState([]);
  const [reachedToEnd,setReachedToEnd] = useState(false);
  const [showUpdateModal,setShowUpdateModal] = useState(false);
  const [selectedProfile,setSelectedProfile] = useState(null);
  const [showConfirmModal,setShowConfirmModal] = useState(false);
  const [busy,setBusy] = useState(false);
  const {updateNotification} = useNotification();
  const {handleSearch,resetSearch,resultNotFound} = useSearch();

  const fetchActors = async(pageNo)=>{
    const {profiles,error} = await getActors(pageNo,limit);
    if(error) return updateNotification('error',error);
    console.log("fetch actors called : "  + pageNo);
    if(!profiles.length){
      //console.log("overflow ji");
      currentPageNo = pageNo-1;  // -1 bcoz if we go the last page and then try next it will go on next page(where profiles length is 0) and then we need to click prev 2 times
      return setReachedToEnd(true);
    }
    setActors([...profiles])
  }

  const handleOnNextClick = ()=>{
    console.log("handleonnext click");
    if(reachedToEnd) return;
    console.log("handleonnext click2");
    currentPageNo +=1;
    fetchActors(currentPageNo);
  }

  const handleOnPrevClick = ()=>{
    //console.log("handleonnext click");
    if(currentPageNo<=0) return;
    if(reachedToEnd) setReachedToEnd(false);
    currentPageNo -=1;
    fetchActors(currentPageNo);
  }

  const handleOnEditClick = (profile)=>{
    setShowUpdateModal(true);
    setSelectedProfile(profile);
    console.log(profile);
  }

  const hideUpdateModal = (profile)=>{
    setShowUpdateModal(false)
  }

  const handleOnSearchSubmit = (value)=>{
    handleSearch(SearchActor,value,setResults);
    //console.log(value);
  }

  const handleSearchFormReset = ()=>{
    resetSearch();
    setResults([]);
  }

  const handleOnActorUpdate = (profile)=>{ // this function will render the actors after admin will update any actor on his own(we dont need to referesh page)
    const updatedActors = actors.map(actor=>{
      if(profile.id===actor.id){
        return profile;
      }
      return actor;
    })
    setActors([...updatedActors])
  }
  
  const handleOnDeleteClick = (profile)=>{
    console.log(profile);
    // setSelectedProfile(profile);
    setShowConfirmModal(true);
  }

  const hideConfirmModal = ()=>{
   return setShowConfirmModal(false);
  }

  const handleOnDeleteConfirm = async()=>{
    // setBusy(true);
    // const {error,message} = await deleteActor(selectedProfile.id)
    // setBusy(false);
    // if(error) return updateNotification('error',error);
    // updateNotification('success',message);
    // hideConfirmModal();
    // fetchActors(currentPageNo)
    console.log("delete feature is disabled from actos.jsx");
    setShowConfirmModal(false);
 }

  useEffect(()=>{
    console.log("useeffect");
    fetchActors(currentPageNo)
  },[]);
  return (
    <>
    <div className='p-5'>
      <div className='flex justify-end mb-5'>
        <AppSearchForm onSubmit={handleOnSearchSubmit} onReset={handleSearchFormReset}
         placeholder='Search Actors' showResetIcon={results.length || resultNotFound} />
      </div>
       <NotFoundText text='Text not found' visible={resultNotFound}/>
      <div className="grid grid-cols-4 gap-5 p-5">
        {results.length || resultNotFound ? results.map(actor=>(
          <ActorProfile profile={actor} key={actor.id}
           onEditClick={()=>handleOnEditClick(actor)}
           onDeleteClick={()=> handleOnDeleteClick(actor)}/>
          ))
          : 
          actors.map(actor=>(
          <ActorProfile profile={actor} key={actor.id} 
          onEditClick={()=>handleOnEditClick(actor)}
          onDeleteClick={()=> handleOnDeleteClick(actor)}/>
          ))
        }
      </div>
      {!results.length && !resultNotFound ? <NextandPrevButton className='mt-5' 
      OnNextClick={handleOnNextClick} OnPrevClick={handleOnPrevClick}/>
      : null
      }   
    </div>
    <ConfirmModal visible={showConfirmModal} busy={busy} title='Are you sure?'
    subtitle='This section will remove this profile permanently'
    onConfirm={handleOnDeleteConfirm} onCancel={hideConfirmModal}/>
    <UpdateActors visible={showUpdateModal} 
    onClose={hideUpdateModal} initialState={selectedProfile}
    onSuccess={handleOnActorUpdate}/>
  </>
  )
}


const ActorProfile = ({profile,onEditClick,onDeleteClick})=>{
  const [showOptions, setShowOtions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = ()=>{
    setShowOtions(true);
  }

  const handleOnMouseLeave = ()=>{
    setShowOtions(false);
  }

  if(!profile) return null;
  const getName = (name)=>{
    if(name.length <= acceptedNameLength) return name;
    return name.substring(0,acceptedNameLength) + "..";
  }

  const {name,avatar,title,about=''} = profile
  return (
    <div className='bg-white shadow dark:shadow dark:bg-secondary 
      rounded h-20 overflow-hidden'>
        <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative">
          <img className='w-20 aspect-square object-cover'
            src={avatar}
            alt={title} />

          <div className='px-2'>
            <h1 className='text-xl text-primary dark:text-white font-semibold'>
              {getName(name)}
            </h1>
            <p className='text-primary dark:text-white opacity-70'>
              {about.substring(0,50)}
            </p>
          </div>

            <Options onEditClick={onEditClick} 
            visible={showOptions}
            onDeleteClick={onDeleteClick}/>
        </div>
      </div>
  )
}

const Options = ({visible,onDeleteClick,onEditClick})=>{
  if(!visible) return null;
  return (
     (
      <div className='absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5'>
        <button onClick={onDeleteClick} className='p-2 rounded-full bg-white text-primary hover:opacity-80 transition' type='button'>
          <BsTrash/>
        </button>
        <button onClick={onEditClick} className='p-2 rounded-full bg-white text-primary hover:opacity-80 transition' type='button'>
          <BsPencilSquare/>
        </button>
      </div>
    ) 
  )
}