import React from 'react'
import Container from './Container';
import NotVerified from './user/NotVerified';
import TopRatedMovies from './user/TopRatedMovies';
import TopRatedWebSeries from './user/TopRatedWebSeries';
import TopRatedTVSeries from './user/TopRatedTVSeries';
import HeroSlideShow from './user/HeroSlideShow';

export default function Home() {
  return <div className="dark:bg-primary bg-white min-h-screen">
    <Container className='px-2 xl:p-0'>
      <NotVerified/>
      {/* slider  */}
      <HeroSlideShow/>
      <div className="space-y-3 py-8">
      {/* Most rated movies */}
      <TopRatedMovies/>
      <TopRatedWebSeries/>
      <TopRatedTVSeries/>
      </div>
    </Container>
  </div>
}
