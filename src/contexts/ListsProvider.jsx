import { createContext, useState, useEffect, useCallback, useContext, useMemo } from "react";
import * as listsApi from '../api/list';
import { useSession } from "./AuthProvider";

export const ListsContext = createContext();
export const useLists = () => useContext(ListsContext);

export const ListsProvider = ({children}) => {
  const { ready } = useSession();
  const [currentListItem, setCurrentListItem] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [listItems, setListItems] = useState([]);

  const refreshListItems = useCallback(async () => {
    try {
      setError();
      setLoading(true);
      const data = await listsApi.getWatchListUser(localStorage.getItem("userId"));
      setListItems(data);
      return data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    if (ready && !initialLoad) {
      refreshListItems();
      setInitialLoad(true);
    }
  }, [ready, initialLoad, refreshListItems]);

  const createOrUpdateListItem = useCallback(async ({id, userId, movieId, watched}) => {
    setError();
    setLoading(true);
    try {
      const changedListItem = await listsApi.saveListItem({id, userId, movieId, watched});
      await refreshListItems();
      return changedListItem;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false)
    }
  }, [refreshListItems]);

  const changeWatched = useCallback(async (id, watched) => {
    const listItem = listItems.find((p) => p.id === id);
    return await createOrUpdateListItem({ id, userId: listItem.userId, movieId: listItem.movie.id, watched });
  }, [listItems, createOrUpdateListItem]);

  const deleteListItem = useCallback(async (id) => {
    setLoading(true);
    setError();
    try {
      await listsApi.deleteListItem(id);
      refreshListItems();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false)
    }
  }, [refreshListItems]);

  const value = useMemo(() => ({
    currentListItem,
    setCurrentListItem,
    listItems,
    error,
    loading,
    changeWatched,
    deleteListItem,
    createOrUpdateListItem
  }), [listItems, error, loading, setCurrentListItem, changeWatched, deleteListItem, currentListItem, createOrUpdateListItem])

  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
};