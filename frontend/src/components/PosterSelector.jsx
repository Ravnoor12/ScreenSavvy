import React from 'react'

const commonPosterUI = "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer"

export default function PosterSelector({name,accept,selectedPoster,onChange,className,label}) {
  return (
    <div>
        <input type="file" accept={accept} id={name} name={name} onChange={onChange} hidden />
        <label htmlFor={name}>
            {selectedPoster? <img className={commonPosterUI+ ' object-cover ' + className}
             src={selectedPoster} alt="" /> : <PosterUI label={label} className={className}/>}
        </label>
    </div>
  )
}

const PosterUI = ({className,label})=>{
    return (
        <div className={commonPosterUI + " "+ className }>
            <span className='dark:text-dark-subtle text-light-subtle'>{label}</span>
        </div>
    )
}