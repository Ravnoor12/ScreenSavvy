import React, { useEffect, useState } from 'react'
import { getSingleMovie } from '../../api/movie';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth, useNotification } from '../../hooks';
import Container from '../Container';
import RatingStar from '../RatingStar';
import RelatedMovies from '../RelatedMovies';
import AddRatingModal from '../modals/AddRatingModal';
import CustomButtonLink from '../CustomButtonLink';
import ProfileModal from '../modals/ProfileModal';
import { convertReviewCount } from '../../utils/helper';



const convertDate = (date) => {
  return date.split('T')[0];
}

export default function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [showRatingModal,setShowRatingModal] = useState(false);
  const [movie, setMovie] = useState({});
  const [showProfileModal,setShowProfileModal] = useState(false);
  const [selectedProfile,setSelectedProfile] = useState({}); 
  const { updateNotification } = useNotification();
  const {authInfo} = useAuth();
  const {isLoggedIn} = authInfo;
  const navigate = useNavigate();

  const { movieId } = useParams(); //movieId coming from the url, for reference check app.js route for single movie

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    if (error) return updateNotification('error', error);
    setReady(true);
    setMovie(movie)
  }

  const handleOnRateMovie = ()=>{
    if(!isLoggedIn) return navigate('/auth/signin')
    setShowRatingModal(true);
  }

  const hideRatingModal = ()=>{
    setShowRatingModal(false);
  }

  const hanldeOnRatingSuccess = (reviews)=>{
    setMovie({...movie,reviews:{...reviews}});
  }
      
  const handleProfileClick = (profile)=>{
    setSelectedProfile(profile);
    setShowProfileModal(true);
  }

  const hideProfileModal = ()=>{
    setShowProfileModal(false);
  }

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  if (!ready) return <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
    <p className='text-light-subtle dark:text-dark-subtle animate-pulse text-2xl'>Please Wait!</p>
  </div>

  const {
    id,
    trailer,
    poster,
    title,
    storyLine,
    language,
    releseDate,
    type,
    director = {},
    reviews = {},
    writers = [],
    cast = [],
    genres = [] } = movie;
  return (
    <div className='dark:bg-primary bg-white min-h-screen pb-10'>
      <Container className='xl:px-0 px-2'>
        <video poster={poster} src={trailer} controls></video>
        <div className="flex justify-between">
          <h1 className='xl:text-4xl lg:text-3xl text-2xl text-highlight dark:text-highlight-dark font-semibold py-3'>
            {title}
          </h1>
          <div className='flex flex-col items-end'>
            <RatingStar rating={reviews.ratingAvg} />
            <CustomButtonLink label={convertReviewCount(reviews.reviewCount)+ ' Reviews'}
             onClick={()=>navigate('/movie/reviews/' + id)}/>

            {/* <Link className='text-highlight dark:text-highlight-dark hover:underline' to={'/movie/reviews/' + id}>
              {convertReviewCount(reviews.reviewCount)} Reviews
            </Link> */}

            <CustomButtonLink label='Rate the Movie'
             onClick={handleOnRateMovie}/>

            {/* <button type='button' onClick={handleOnRateMovie}
            className='text-highlight dark:text-highlight-dark hover:underline'>
              Rate The Movie
            </button> */}

          </div>
        </div>

        <div className="space-y-3">
          <p className='text-light-subtle dark:text-dark-subtle'>{storyLine}</p>

          {/* <div className="flex space-x-2">
            <p className='text-light-subtle dark:text-dark-subtle'>Director:</p>
            <p className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer'>{director.name}</p>
          </div> */}

            <ListWithLabel label='Director: '>
              <CustomButtonLink label={director.name} onClick={()=>handleProfileClick(director)}/>
            </ListWithLabel>

        {/* <div className="flex">
          <p className='text-light-subtle dark:text-dark-subtle mr-2'>Writers:</p>

          <div className="flex space-x-2">
            {writers.map(w => {
              return <p key={w.id} className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer'>{w.name}</p>
            })}
          </div>
        </div> */}

          <ListWithLabel label='Writers: '>
            {writers.map(w => {
              return <CustomButtonLink label={w.name} key={w.id}/>
            })}  
          </ListWithLabel>

        {/* <div className="flex">
          <p className='text-light-subtle dark:text-dark-subtle mr-2'>Cast:</p>
          <div className="flex space-x-2">
            {cast.map(c => {
              return (
                c.leadActor ? <p key={c.profile.id} className='text-highlight dark:text-highlight-dark hover:underline cursor-pointer'>
                  {c.profile.name}
                </p> : null
              )
            })}
          </div>
        </div> */}

        <ListWithLabel label='Cast: '>
            {cast.map(({id,profile,leadActor}) => {
              return leadActor ? (<CustomButtonLink label={profile.name} key={id}/>): null
            })}  
          </ListWithLabel>

        {/* <div className="flex space-x-2">
          <p className='text-light-subtle dark:text-dark-subtle'>Language:</p>
          <p className='text-highlight dark:text-highlight-dark'>{language}</p>
        </div> */}

        <ListWithLabel label='Language: '>
              <CustomButtonLink label={language} clickable={false}/>
        </ListWithLabel>

        {/* <div className="flex space-x-2">
          <p className='text-light-subtle dark:text-dark-subtle'>Release Date:</p>
          <p className='text-highlight dark:text-highlight-dark'>{convertDate(releseDate)}</p>
        </div> */}

        <ListWithLabel label='Release Date: '>
              <CustomButtonLink label={convertDate(releseDate)} clickable={false}/>
        </ListWithLabel>

        {/* <div className="flex">
          <p className='text-light-subtle dark:text-dark-subtle mr-2'>Genres:</p>
          <div className="flex space-x-2">
            {genres.map((g) => {
              return (
                <p key={g} className='text-highlight dark:text-highlight-dark'>
                  {g}
                </p>
              )
            })}
          </div>
        </div> */}
        <ListWithLabel label='Genres: '>
            {genres.map((g) => {
              return <CustomButtonLink label={g} key={g} clickable={false}/>
            })}  
          </ListWithLabel>

        {/* <div className="flex space-x-2">
          <p className='text-light-subtle dark:text-dark-subtle'>Type:</p>
          <p className='text-highlight dark:text-highlight-dark'>{type}</p>
        </div> */}

        <ListWithLabel label='Type: '>
              <CustomButtonLink label={type} clickable={false}/>
        </ListWithLabel>

          <CastProfiles cast={cast}/>
          <RelatedMovies movieId={movieId}/>
        </div>
        
      </Container>

        <ProfileModal
        visible={showProfileModal} onClose={hideProfileModal} profileId={selectedProfile.id}/>

      <AddRatingModal visible={showRatingModal} 
      onClose={hideRatingModal}
      onSuccess={hanldeOnRatingSuccess}/>
    </div>
  )
}

const ListWithLabel = ({children,label})=>{
  return (
    <div className="flex space-x-2">
            <p className='text-light-subtle dark:text-dark-subtle'>{label}</p>
            {children}
          </div>
  )
}

const CastProfiles = ({cast})=>{
  return (
    <div >
          <h1 className='text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2'></h1>
          <div className='flex flex-wrap space-x-4'>
            {cast.map(({profile,id,roleAs}) => {
              return <div key={id} className='basis-28 flex flex-col items-center text-center mb-4'>
                <img className='w-24 h-24 aspect-square object-cover rounded-full' src={profile.avatar} />
                <CustomButtonLink label={profile.name}/>
                <span className='text-light-subtle dark:text-dark-subtle text-sm'> as </span>
                <p className='text-light-subtle dark:text-dark-subtle'>{roleAs}</p>
              </div>
            })}
          </div>
        </div> 
  )
}