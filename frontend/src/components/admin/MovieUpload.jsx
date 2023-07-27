import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { uploadMovie, uploadTrailer } from '../../api/movie';
import { useNotification } from '../../hooks'
import ModalContainer from '../modals/ModalContainer';
import MovieForm from './MovieForm';

export default function MovieUpload({visible,onClose}) {
    const [videoSelected, setVideoSelected] = useState(false);
    const [videoUploaded, setvideoUploaded] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoInfo,setVideoInfo] = useState({});
    const [busy,setBusy] = useState(false);
    const { updateNotification } = useNotification();

    const resetState = ()=>{
        setVideoSelected(false);
        setvideoUploaded(false);
        setUploadProgress(0);
        setVideoInfo({});
    }

    const handleTypeError = (error) => {
        updateNotification('error', error);
    }
    const handleUploadTrailer = async(data)=>{
        const {error,url,public_id} = await uploadTrailer(data,setUploadProgress);
        if(error) return updateNotification('error',error);
        setvideoUploaded(true);
        setVideoInfo({url,public_id});
    }
    const handleChange = (file) => {
        const formData = new FormData();
        formData.append('video', file);  // this 'video is from movie.js route file having uploadVideo.single('video')
        setVideoSelected(true);
        handleUploadTrailer(formData);
    } 

    const getUploadProgressValue = ()=>{
        if(!videoUploaded && uploadProgress>=100){
            return 'Processing'
        }
        return `Upload progress ${uploadProgress}%`
    }

    const handleSubmit = async(data)=>{
        if(!videoInfo.url || !videoInfo.public_id) return updateNotification('error','Trailers is missing')
        setBusy(true);
        data.append('trailer',JSON.stringify(videoInfo));
        const {error,movie} = await uploadMovie(data);
        setBusy(false);
        if(error) return updateNotification('error',error);
        console.log(movie);
        updateNotification('success','Movie uploaded successfully.')
        resetState();
        onClose();
    }

    return (<>
        <ModalContainer visible={visible} >
            <div className="mb-5">
                <UploadProgress visible={!videoUploaded && videoSelected} messsage={getUploadProgressValue()} width={uploadProgress}/>
            </div>
            {!videoSelected ?
                (
                    <TrailerSelector visible={!videoSelected} onTypeError={handleTypeError}
                        handleChange={handleChange} />   
                ): (
                    <MovieForm btnTitle="Upload" busy={busy} onSubmit={!busy ? handleSubmit : null}/>
                )
            }
        </ModalContainer>
        </>
    )
}

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
    if (!visible) return null;

    return (
        <div className="h-full flex items-center justify-center">
            <FileUploader handleChange={handleChange} onTypeError={onTypeError} types={['mp4', 'avi']} >
                <label className="w-48 h-48 border border-dashed 
            dark:border-dark-subtle border-light-subtle rounded-full 
            flex flex-col items-center justify-center dark:text-dark-subtle cursor-pointer">
                    <AiOutlineCloudUpload size={80} />
                    <p>Drop your file here!</p>
                </label>
            </FileUploader>
        </div>
    )
}

const UploadProgress = ({width,messsage,visible}) => {
    if(!visible) return null;
    return (
            <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3"> {/* background of loading progress */}
                <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
                    <div style={{ width: width + '%' }} className="h-full absolute left-0 dark:bg-white bg-secondary" />  {/* this div will render inside the parent div working to fill the bar*/}
                </div>
                <p className='font-semibold dark:text-dark-subtle
                 text-light-subtle animate-pulse mt-1'>
                    {messsage}</p>
            </div>
    )
}
