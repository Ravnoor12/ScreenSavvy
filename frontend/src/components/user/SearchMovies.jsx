import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchPublicMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import NotFoundText from '../NotFoundText';
import MovieList from './MovieList';
import Container from '../Container';

export default function SearchMovies() {
  const [movies,setMovies] = useState([]); 
  const [resultNotFound,setResutNotFound] = useState(false); 
  const {updateNotification} = useNotification();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("title");
  //console.log(searchParams.get("title"));

  const searchMovies = async(val)=>{
    //console.log("hi from search Movies");
    const {results,error} = await searchPublicMovies(val);
    if(error) return updateNotification('error',error);
    if(!results.length){
      setResutNotFound(true);
      return setMovies([]);
    }
    setResutNotFound(false);
    //console.log(results);
    setMovies([...results])
  }

  useEffect(()=>{
    if(query.trim()) searchMovies(query);
  },[query]);
  return ( 
    <div className="dark:bg-primary bg-white min-h-screen py-8">
    <Container className='px-2 xl:p-0'>
      <NotFoundText text='Record Not found!' visible={resultNotFound}/>
      <MovieList movies={movies}/>
      </Container>
    </div>
  )
}
