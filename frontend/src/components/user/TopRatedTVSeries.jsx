import React, { useEffect, useState } from 'react'
import MovieList from './MovieList';
import { useNotification } from '../../hooks';
import { getTopRatedMovies } from '../../api/movie';

export default function TopRatedTVSeries() {
    const [movies,setMovies] = useState([]);
    const {updateNotification} = useNotification();
  
    const fetchMovies = async(signal)=>{
      const {error,movies} = await getTopRatedMovies('TV Series',signal);
      if(error) return updateNotification('error',error);
      setMovies([...movies]);
    }
  
    useEffect(()=>{
      const ac = new AbortController();
      fetchMovies(ac.signal);
      return ()=>{
        ac.abort();
      }
    },[]);
    return (
      <MovieList movies={movies} title='Viewers choice (TV Series)'/>
    )
}
