import React, { useEffect, useState } from 'react';
import { useNotification, useSearch } from '../../hooks';
import { languageOptions, statusOptions, typeOptions } from '../../utils/options';
import { commonInputClasses } from '../../utils/theme';
import CastForm from '../form/CastForm';
import Submit from '../form/Submit';
import GenresSelector from '../GenresSelector';
import CastModal from '../modals/CastModal';
import GenresModal from '../modals/GenresModal';
import WritersModal from '../modals/WritersModal';
import PosterSelector from '../PosterSelector';
import Selector from '../Selector';
import TagsInput from '../TagsInput';
import Label from '../Label';
import DirectorSelector from '../DirectorSelector';
import WriterSelector from '../WriterSelector';
import ViewAllBtn from '../ViewAllButton';
import LabelWithBadge from '../LabelWithBadge';
import { validateMovie } from '../../utils/validator';


const defaultMovieInfo = {
  title: '',
  storyLine: '',
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: '',
  poster: null,
  genres: [],
  type: '',
  language: '',
  status: ''
}



export default function MovieForm({onSubmit,busy,initialState,btnTitle}) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState('');
  const { updateNotification } = useNotification();
  //const { handleSearch, searching, results, resetSearch } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const {error} = validateMovie(movieInfo);
    if(error) return updateNotification('error',error);
    // cast,tags,genres,writers need to be in string form, bcoz we are parsing them in backend
    const {tags,genres,cast,writers,director,poster} = movieInfo;

    const formData = new FormData();  
    const finalMovieInfo = {
      ...movieInfo
    };
    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    const finalCast = cast.map((c)=>({
      actor:c.profile.id,
      roleAs:c.roleAs,
      leadActor:c.leadActor
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if(writers.length){
      const finalWriters = writers.map(w=>w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }
    if(director.id){
      finalMovieInfo.director = director.id
    }
    if(poster)finalMovieInfo.poster = poster
    for(let key in finalMovieInfo){
      formData.append(key,finalMovieInfo[key]);
    }

    // formData.append('tags',JSON.stringify(tags));
    // formData.append('genres',JSON.stringify(genres))
    // if(writers.length){
    //   const finalWriters = writers.map(w=>w.id);
    //   formData.append('writers',JSON.stringify(finalWriters));
    // }
    onSubmit(formData);
  }

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file)
    setSelectedPosterForUI(url);
  }

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === 'poster') {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    setMovieInfo({ ...movieInfo, [name]: value });
  }

  const updateTags = (tags) => {
    //const {value,name} = target;
    setMovieInfo({ ...movieInfo, tags });
  }

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  }

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  }

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  }

  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification('warning', 'This is profile is already selected!')
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  }

  const hideWritersModal = () => {
    setShowWritersModal(false);
  }
  const displayWritersModal = () => {
    setShowWritersModal(true);
  }

  const hideCastModal = () => {
    setShowCastModal(false);
  }
  const displayCastModal = () => {
    setShowCastModal(true);
  }

  const hideGenresModal = () => {
    setShowGenresModal(false);
  }
  const displayGenresModal = () => {
    setShowGenresModal(true);
  }

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId)
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] })
  }

  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId)
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] })
  }

  useEffect(()=>{
    if(initialState){
      setMovieInfo({...initialState,
        releseDate:initialState.releseDate.split("T")[0]
        ,poster:null});
      setSelectedPosterForUI(initialState.poster)
    }
  },[initialState]);

  const { title, storyLine, writers, cast, tags, genres, type, language, status,releseDate } = movieInfo;
  return (
    <>
      <div className='flex space-x-3'>
        <div className='w-[70%] space-y-5'>
          <div>
            <Label htmlFor='title'>Title</Label>
            <input type="text" id='title' value={title} onChange={handleChange} name='title'
              className={commonInputClasses + ' border-b-2 text-xl  font-semibold'} placeholder='Titanic' />
          </div>
          <div>
            <Label htmlFor='storyLine'>Story Line</Label>
            <textarea name="storyLine" id="storyLine" value={storyLine} onChange={handleChange}
              className={commonInputClasses + ' border-b-2 resize-none h-24'}
              placeholder='Movie story'></textarea>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>
          <DirectorSelector onSelect={updateDirector}/>
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">writers</LabelWithBadge>
              <ViewAllBtn visible={writers.length} onClick={displayWritersModal}>View All</ViewAllBtn>
            </div>

            <WriterSelector onSelect={updateWriters}/>
          </div>
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length} >Add Cast & Crew</LabelWithBadge>
              <ViewAllBtn visible={cast.length} onClick={displayCastModal} >View All</ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>
          <input type="date" name="releseDate" value={releseDate}
            className={commonInputClasses + " border-2 rounded p-1 w-auto"} onChange={handleChange} />
          <Submit busy={busy} value={btnTitle} onClick={handleSubmit} type='button' />
        </div>
        <div className='w-[30%] space-y-5'>
          <PosterSelector name='poster' label='Select poster' accept='image/jpg, image/jpeg, image/png'
            onChange={handleChange} selectedPoster={selectedPosterForUI} />
          <GenresSelector badge={genres.length} onClick={displayGenresModal}>Select Genres</GenresSelector>

          <Selector onChange={handleChange} name='type' value={type} options={typeOptions} label='Type' />
          <Selector onChange={handleChange} name='language' value={language} options={languageOptions} label='Language' />
          <Selector onChange={handleChange} name='status' value={status} options={statusOptions} label='Status' />
        </div>
      </div>
      {/* <ModalContainer onClose={()=>setShowModal(false)} visible={showModal}>
          <div className="p-20 bg-red-200"></div>
        </ModalContainer> */}

      <WritersModal onClose={hideWritersModal}
        profiles={writers} visible={showWritersModal}
        onRemoveClick={handleWriterRemove}
      ></WritersModal>
      <CastModal onClose={hideCastModal}
        casts={cast} visible={showCastModal}
        onRemoveClick={handleCastRemove}
      ></CastModal>
      <GenresModal onSubmit={updateGenres} visible={showGenresModal}
        onClose={hideGenresModal} previousSelection={genres}></GenresModal>
    </>
  )
}




