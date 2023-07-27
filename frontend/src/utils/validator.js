export const validateMovie = (movieInfo)=>{
    const {title,storyLine,language,releseDate,status,type,genres,tags,cast} = movieInfo; 
    if(!title.trim()) return {error:'Title is missing!'}
    if(!storyLine.trim()) return {error:'Story line is missing!'}
    if(!language.trim()) return {error:'language is missing!'}
    if(!releseDate || !releseDate.trim()) return {error:'Relese date is missing!'}
    if(!status.trim()) return {error:'Status is missing!'}
    if(!type.trim()) return {error:'Type is missing!'}
    if(!type.trim()) return {error:'Type is missing!'}
    // validation for genres, we are checking if genres is array or not
    if(!genres.length) return {error:'Genres are missing!'}
    //checking genres needs to be a field with string as a value
    for(let gen of genres){
      if(!gen.trim()) return {error:'Invalid genres!'}
    }
    // validation for tags, we are checking if tags is array or not
    if(!tags.length) return {error:'Tags are missing!'}
    //checking tags needs to be a field with string as a value
    for(let tag of tags){
      if(!tag.trim()) return {error:'Invalid tags!'}
    } 
  
    // validation for cats, we are checking if cast is array or not
    if(!cast.length) return {error:'Cast and crew are missing!'}
    //checking cast bcoz it needs to be a field with object as value
    for(let c of cast){
      if(typeof c !== 'object') return {error:'Invalid cast!'}
    } 
    return {error:null};
  }