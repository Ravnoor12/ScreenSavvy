import React, { useEffect, useState } from 'react' 
import AppInfoBox from '../AppInfoBox'
import LatestUploads from '../LatestUploads'
import { getAppInfo } from '../../api/admin'
import { useNotification } from '../../hooks'
import MostRatedMovies from '../MostRatedMovies'

export default function Dashboard() {
  const [appInfo,setAppInfo] = useState({
    movieCount:0,
    reviewCount:0,
    userCount:0
  }) 
  const {updateNotification} = useNotification();
  const fetchAppInfo = async()=>{
    const {appInfo,error} = await getAppInfo();
    if(error) return updateNotification('error',error);
    setAppInfo({...appInfo});
  }

  useEffect(()=>{
    fetchAppInfo()
  },[]);
  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title='Total uploads' subTitle={appInfo.movieCount.toLocaleString()}/>
      <AppInfoBox title='Total reviews' subTitle={appInfo.reviewCount.toLocaleString()}/>
      <AppInfoBox title='Total users' subTitle={appInfo.userCount.toLocaleString()}/>

      <LatestUploads/>
      <MostRatedMovies/>
    </div>
  )
}
