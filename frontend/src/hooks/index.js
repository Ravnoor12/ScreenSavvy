import { useContext } from "react"
import { AuthContext } from "../context/AuthProvider";
import { NotificationContext } from "../context/NotificationProvider"
import { ThemeContext } from "../context/ThemeProvider"
import { SearchContext } from "../context/SearchProvider";
import { MovieContext } from "../context/MoviesProvider";

export const useTheme = () => {
    return useContext(ThemeContext);
}

export const useNotification = ()=>{
    return useContext(NotificationContext);
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}

export const useSearch = ()=>{
    return useContext(SearchContext);
}

export const useMovies = ()=> useContext(MovieContext);