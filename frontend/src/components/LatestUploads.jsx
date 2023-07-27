import React, { useEffect, useState } from 'react'
import MovieListItem from './MovieListItem'
import { deleteMovies, getMovieForUpdate, getMovies } from '../api/movie'
import { useMovies, useNotification } from '../hooks';
import ConfirmModal from './modals/ConfirmModal';
import UpdateMovie from './modals/UpdateMovie';

const pageNo = 0;
const limit=5;
export default function LatestUploads() {
  const [movies,setMovies] = useState([]);
  const [showConfirmModal,setShowConfirmModal] = useState(false);
  const [selectedMovie,setSelectedMovie] = useState(null);
  const [busy,setBusy] = useState(false);
  const [showUpdateModal,setShowUpdateModal] = useState(false);
  const {updateNotification} = useNotification();
  const {fetchLatestUploads,latestUploads} = useMovies();

  // const fetchLatestUploads = async()=>{
  //   const {error,movies} = await getMovies(pageNo,limit);
  //   if(error) return updateNotification('error',error);
  //   setMovies([...movies]);
  // }

  // const handleOnDeleteClick = (movie)=>{
  //   //console.log("handle delete click from latestUploadsjsx");
  //   setSelectedMovie(movie)
  //   setShowConfirmModal(true);

  // }

  // const hideConfirmModal = ()=> setShowConfirmModal(false);

  // const handleOnDeleteConfirm = async()=>{
  //   setBusy(true);
  //   const {error,message} = await deleteMovies(selectedMovie.id);
  //   setBusy(false)
  //   if(error) return updateNotification('error',error);

  //   updateNotification('success',message);
  //   fetchLatestUploads();
  //   hideConfirmModal();
  // }
  // const handleOnEditClick = async({id})=>{
  //   setShowUpdateModal(true);
  //   const {error,movie} = await getMovieForUpdate(id);
  //   if(error) return updateNotification('error',error);
  //   setSelectedMovie(movie);
  // }

  // const handleOnUpdate = (movie)=>{
  //   const updatedMovies = movies.map(m=>{
  //     if(m.id===movie.id) return movie;
  //     return m;
  //   });
  //   setMovies([...updatedMovies]);
  // }

  //const hideUpdateModal = ()=> setShowUpdateModal(false);
  
  const handleUIUpdate= ()=> fetchLatestUploads();

  useEffect(()=>{
    fetchLatestUploads();
  },[]);

  return (
    <>
    <div className="bg-white shadow dark:shadow
     dark:bg-secondary p-5 rounded col-span-2">
        <h1 className='font-semibold mb-2 text-primary dark:text-white text-xl'>Recent Uploads</h1>
        <div className="space-y-3">
          {latestUploads.map(movie=>{
            return <MovieListItem movie={movie} key={movie.id} 
            afterDelete={handleUIUpdate}
            afterUpdate={handleUIUpdate}/>
          })}
        </div>

        {/* <ConfirmModal visible={showConfirmModal} title="Are you sure"
        subtitle="This action will remove this movie permanently" 
        onCancel={hideConfirmModal} onConfirm={handleOnDeleteConfirm} busy={busy}/>

        <UpdateMovie visible={showUpdateModal} 
        onClose={hideUpdateModal} initialState={selectedMovie}
        onSuccess={handleOnUpdate}/> */}
        {/* <MovieListItem
        movie={
          {
            poster:"https://images.pexels.com/photos/14306688/pexels-photo-14306688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            title: "this is a title",
            status: 'public',
            genres: ['action','comedy'],
          }
        }/> */}
    </div>
  </>
  )
}

