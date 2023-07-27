import React, { useState } from 'react'   
import {BsTrash,BsPencilSquare, BsBoxArrowUpRight} from 'react-icons/bs'
import ConfirmModal from './modals/ConfirmModal'
import { deleteMovies } from '../api/movie';
import { useNotification } from '../hooks';
import UpdateMovie from './modals/UpdateMovie';
import { getposter } from '../utils/helper';

const MovieListItem = ({movie,afterDelete,afterUpdate})=>{
    const [showConfirmModal,setShowConfirmModal] = useState(false);
    const [showUpdateModal,setShowUpdateModal] = useState(false);
    const [selectedMovieId,setSelectedMovieId] = useState(false);
    const [busy,setBusy] = useState(false);

    const {updateNotification} = useNotification();

    const handleOnDeleteConfirm = async()=>{
        setBusy(true);
        const {error,message} = await deleteMovies(movie.id);
        setBusy(false);
        if(error) return updateNotification('error',error);
        hideConfirmModal(false);
        updateNotification('success',message);
        afterDelete(movie);
      }

      const handleOnEditClick = ()=>{
        setShowUpdateModal(true);
        setSelectedMovieId(movie.id);
      }

      const handleOnUpdate = (movie)=>{
        afterUpdate(movie);
        setShowUpdateModal(false);
        setSelectedMovieId(null);
      }

      const displayConfirmModal = ()=> setShowConfirmModal(true);
      const hideConfirmModal = ()=> setShowConfirmModal(false);

    return(
    <>
     <MovieCard movie={movie} onDeleteClick={displayConfirmModal} onEditClick={handleOnEditClick}/>
    <div className='p-0'>
        <ConfirmModal visible={showConfirmModal} busy={busy}
        onConfirm={handleOnDeleteConfirm} onCancel={hideConfirmModal}
        title='Are your sure?' subtitle='This action will remove this movie permanently'/>
        <UpdateMovie visible={showUpdateModal} movieId={selectedMovieId}
        onSuccess={handleOnUpdate} />
    </div>
    </>
    )
}

const MovieCard = ({movie,onDeleteClick,onEditClick,onOpenClick})=>{
    const {poster,title,genres=[],status,responsivePosters} = movie
    return (
        <table className='w-full border-b'>
            <tbody>
                <tr>
                    <td>
                        <div className='w-24'>
                        <img className='w-full aspect-video' src={getposter(responsivePosters) || poster} alt={title} />
                        </div>
                    </td>
                    <td className='w-full pl-5'>
                        <div>
                            <h1 className='text-lg font-semibold text-primary dark:text-white'>
                                {title}</h1>
                            <div className='space-x-1'>
                                {
                                    genres.map((g,index)=>{
                                        return <span key={g+index} className='font-semibold text-primary dark:text-white text-xs'>
                                                {g}
                                            </span>
                                    })
                                }
                                {/* <span className='font-semibold text-primary dark:text-white text-xs'>
                                    Action
                                </span>
                                <span className='font-semibold text-primary dark:text-white text-xs'>
                                    Drama
                                </span> */}
                            </div>
                        </div>
                    </td>
                    <td className='px-5'>
                        <p className='text-primary dark:text-white'>{status}</p>
                    </td>
                    <td>
                        <div className='flex items-center space-x-3 text-primary dark:text-white text-lg'>
                            <button onClick={onDeleteClick} type='button'><BsTrash/></button>
                            <button onClick={onEditClick} type='button'><BsPencilSquare/></button>
                            <button onClick={onOpenClick} type='button'><BsBoxArrowUpRight/></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}


export default MovieListItem