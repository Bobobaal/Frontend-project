import { createContext, useState, useEffect, useCallback, useContext, useMemo } from "react";
import * as moviesApi from '../api/movie';
import { useSession } from "./AuthProvider";

export const MoviesContext = createContext();
export const useMovies = () => useContext(MoviesContext);

export const MoviesProvider = ({children}) => {
  const {ready} = useSession();
  const [currentMovie, setCurrentMovie] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [movies, setMovies] = useState([]);

  const refreshMovies = useCallback(async () => {
    setError();
    setLoading(true);
    try{
      const data = await moviesApi.getAllMovies();
      setMovies(data);
      return data;
    } catch(error){
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(ready && !initialLoad){
      refreshMovies();
      setInitialLoad(true);
    }
  }, [ready, initialLoad, refreshMovies]);

  const createOrUpdateMovie = useCallback(async ({id, title, releaseYear, synopsis, imdbLink}) => {
    setError();
    setLoading(true);
    try{
      const changedMovie = await moviesApi.saveMovie({id, title, releaseYear, synopsis, imdbLink});
      await refreshMovies();
      return changedMovie;
    }catch(error) {
      console.error(error);
      throw error;
    }finally {
      setLoading(false);
    }
  }, [refreshMovies]);

  const deleteMovie = useCallback(async (id) => {
    setLoading(true);
    setError();
    try{
      await moviesApi.deleteMovie(id);
      refreshMovies();
    }catch(error){
      console.error(error);
      throw error;
    }finally{
      setLoading(false)
    }
  }, [refreshMovies]);

  const setMovieToUpdate = useCallback((id) => {
    setCurrentMovie(id === null ? {} : movies.find((m) => m.id === id));
  }, [movies])

  const value = useMemo(() => ({
    currentMovie,
    setCurrentMovie,
    movies,
    error,
    loading,
    deleteMovie,
    createOrUpdateMovie,
    setMovieToUpdate
  }), [movies, error, loading, setCurrentMovie, deleteMovie, currentMovie, createOrUpdateMovie, setMovieToUpdate]);

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
};