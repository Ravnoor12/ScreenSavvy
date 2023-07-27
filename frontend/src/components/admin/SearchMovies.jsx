import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMoviesForAdmin } from '../../api/movie';
import { useNotification } from '../../hooks';
import MovieListItem from '../MovieListItem';
import NotFoundText from '../NotFoundText';

export default function SearchMovies() {
  const [movies,setMovies] = useState([]); 
  const [resultNotFound,setResutNotFound] = useState(false); 
  const {updateNotification} = useNotification();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("title");
  //console.log(searchParams.get("title"));

  const searchMovies = async(val)=>{
    //console.log("he from search Movies");
    const {results,error} = await searchMoviesForAdmin(val);
    if(error) return updateNotification('error',error);
    if(!results.length){
      setResutNotFound(true);
      return setMovies([]);
    }
    setResutNotFound(false);
    console.log(results);
    setMovies([...results])
  }

  const handleAfterDelete = (movie)=>{
    const updatedMovies = movies.filter(m=>{
      if(m.id!==movie.id) return m;
    });
    setMovies([...updatedMovies]);
  } 
  const handleAfterUpdate = (movie)=>{
    const updatedMovies = movies.map(m=>{
      if(m.id===movie.id) return movie;
      return m;
    });
    setMovies([...updatedMovies]);
  }

  useEffect(()=>{
    if(query.trim()) searchMovies(query);
  },[query]);
  return ( 
    <div className='p-5 space-y-3'>
      <NotFoundText text='Record Not found!' visible={resultNotFound}/>
      {!resultNotFound && movies.map(movie=>{
        return <MovieListItem movie={movie} key={movie.id}
        afterDelete={handleAfterDelete} afterUpdate={handleAfterUpdate}/>
      }) }
    </div>
  )
}
