import React, {createContext, useEffect} from 'react'

export const ThemeContext = createContext();
//Context api is used when we we need to use it at many components and 
//hence we make it globally so that we doesn't need to pass it as props again and again

const defaultTheme = 'light';
const darkTheme = 'dark'

export default function ThemeProvider({children}){
    const toggleTheme = () => {
      const oldTheme = getTheme();
      const newTheme = oldTheme=== defaultTheme? darkTheme : defaultTheme;
      updateTheme(newTheme,oldTheme);
      // document.documentElement.classList.remove(oldTheme);
      // document.documentElement.classList.add(newTheme);
      // localStorage.setItem('theme',newTheme);
    };

    useEffect(()=>{
        const theme = getTheme();
        if(!theme) updateTheme(defaultTheme);
        else updateTheme(theme);
    },[]);
  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
        {children}
    </ThemeContext.Provider>
  );
}

const getTheme = ()=>{
    return localStorage.getItem("theme");
}

const updateTheme = (theme,themeToremove)=>{
    if(themeToremove)  document.documentElement.classList.remove(themeToremove);
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme',theme);
}