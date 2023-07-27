import React from 'react'

export default function Selector({name,options,value,label,onChange}) {
  return (
    <select className='border-2 dark:border-dark-subtle border-light-subtle
     dark:focus:border-white focus:border-primary
      p-1 pr-10 outline-none transition rounded bg-transparent
      text-light-subtle dark:text-dark-subtle 
      dark:focus:text-white focus:text-primary'
        id={name} name={name} value={value} onChange={onChange}>
        <option className='text-primary' value="">{label}</option>
        {options.map(({title,value})=>{
            return <option className='dark:text-primary' key={title} value={value}>{title}</option>
        })}
    </select>
  )
}
