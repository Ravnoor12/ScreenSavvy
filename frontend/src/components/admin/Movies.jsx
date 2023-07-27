import React, { useEffect } from 'react'
import MovieListItem from '../MovieListItem'
import { useState } from 'react'
import { deleteMovies, getMovieForUpdate, getMovies } from '../../api/movie';
import { useMovies, useNotification } from '../../hooks'
import NextandPrevButton from '../NextandPrevButton';


const limit = 1
let currentPageNo = 0;

export default function Movies() {
  const [movies,setMovies] = useState([]);
  const [reachedToEnd,setReachedToEnd] = useState(false);
  const [showUpdateModal,setShowUpdateModal] = useState(false);
  const [showConfirmModal,setShowConfirmModal] = useState(false);
  const [busy,setBusy] = useState(false);
  const [selectedMovie,setSelectedMovie] = useState(null);
  const {updateNotification} = useNotification();

  const {fetchMovies,movies:newMovies,fetchPrevPage,fetchNextPage} = useMovies();

  // const fetchMovies = async(pageNo)=>{
  //   const {error,movies} = await getMovies(pageNo,limit)
  //   if(error) return updateNotification('error',error);
  //   if(!movies.length) {
  //     currentPageNo = pageNo-1; // so that if we click next after reaching last page, then we can go back to prev by clicking once only
  //     return setReachedToEnd(true);
  //   }
  //   setMovies([...movies]);
  //   console.log(movies);
  // }

  // const handleOnNextClick = ()=>{
  //   if(reachedToEnd) return;
  //   currentPageNo+=1;
  //   fetchMovies(currentPageNo);
  // }
  // const handleOnPrevClick = ()=>{
  //   if(currentPageNo<=0) return;
  //   if(reachedToEnd) setReachedToEnd(false);
  //   currentPageNo-=1;
  //   fetchMovies(currentPageNo);

  // }

  // const handleOnEditClick = async({id})=>{
  //   const {movie,error} = await getMovieForUpdate(id);
  //   if(error) return updateNotification('error',error);
  //   setSelectedMovie(movie);
  //   console.log(movie);
  //   setShowUpdateModal(true);
  // }

  // const handleOnDeleteClick = (movie)=>{
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  //   console.log(movie);
  // }

  // const handleOnDeleteConfirm = async()=>{
  //   setBusy(true);
  //   const {error,message} = await deleteMovies(selectedMovie.id);
  //   setBusy(false);
  //   if(error) return updateNotification('error',error);
  //   updateNotification('success',message);
  //   hideConfirmModal(false);
  //   fetchMovies(currentPageNo);
  // }

  // const hideUpdateForm = ()=>{
  //   return setShowUpdateModal(false);
  // }

  // const hideConfirmModal = ()=> setShowConfirmModal(false);

  // const handleOnUpdate = (movie)=>{
  //   const updatedMovies = movies.map(m=>{
  //     if(m.id===movie.id) return movie; // shows the updated movie
  //     return m;
  //   })
  //   setMovies([...updatedMovies]);
  // }

  const handleUIUpdate = ()=> fetchMovies();

  useEffect(()=>{
    fetchMovies();  // getting this function from useMovie hooks
  },[]);

  return (
    <>
    <div className="space-y-3 p-5">
      {newMovies.map(movie=>{
        return <MovieListItem key={movie.id} 
        movie={movie} 
        afterDelete={handleUIUpdate}
        afterUpdate={handleUIUpdate}
        // onEditClick={()=>handleOnEditClick(movie)}
        // onDeleteClick={()=>handleOnDeleteClick(movie)}
        />
      })}
      <NextandPrevButton className='mt-5' 
      OnNextClick={fetchNextPage} OnPrevClick={fetchPrevPage}/>
    </div>
    {/* <ConfirmModal visible={showConfirmModal} busy={busy}
    onConfirm={handleOnDeleteConfirm} onCancel={hideConfirmModal}
    title='Are your sure?' subtitle='This action will remove this movie permanently'/>
    <UpdateMovie visible={showUpdateModal} initialState = {selectedMovie}
    onSuccess={handleOnUpdate} onClose={hideUpdateForm}/> */}
    </>
  )
}
