import {memo, useCallback, useState} from 'react'
import { Typography, Card, CardContent, useTheme, CardActions,
Button, TextField, MenuItem, ToggleButton, Alert } from "@mui/material";
import { useLists } from '../contexts/ListsProvider';
import { useMovies } from '../contexts/MoviesProvider';
import { useSession } from '../contexts/AuthProvider';

const ListItem = memo(({id, movie, userId, watched}) => {
  const {deleteListItem, changeWatched, createOrUpdateListItem, listItems} = useLists();
  const [changedMovieId, setChangedMovieId] = useState(movie.id);
  const [inEdit, setInEdit] = useState(false);
  const [dupeError, setDupeError] = useState(false);
  const {movies} = useMovies();
  const {tokenValid} = useSession();

  const handleRemove = useCallback(async () => {
    const {stillValid} = await tokenValid();
    if(stillValid) deleteListItem(id);
  }, [deleteListItem, id, tokenValid])

  const handleCancel = useCallback(async () => {
    setInEdit(!inEdit);
    setChangedMovieId(movie.id);
    await tokenValid();
  }, [setChangedMovieId, movie, setInEdit, inEdit, tokenValid]);

  const handleWatched = useCallback(async () => {
    const {stillValid} = await tokenValid();
    if(stillValid) changeWatched(id, !watched);
  }, [changeWatched, id, watched, tokenValid]);

  const handleMovie = useCallback((e) => {
    setChangedMovieId(e.target.value);
  }, [setChangedMovieId]);

  const handleEdit = useCallback(async () => {
    const {stillValid} = await tokenValid();
    if(stillValid){
      if(inEdit){
        const filteredList = listItems.filter((item) => item.movie.id.includes(changedMovieId))
        if(filteredList.length === 0){
          createOrUpdateListItem({id, userId, movieId: changedMovieId, watched});
          setInEdit(!inEdit);
          setDupeError(false);
        }
        if(changedMovieId === movie.id){
          setInEdit(!inEdit);
          setDupeError(false);
        }else {
          setDupeError(true);
        }
      }else{
        setInEdit(!inEdit);
      }
    }
  }, [setInEdit, inEdit, createOrUpdateListItem, changedMovieId, id, userId, listItems, setDupeError, movie, watched, tokenValid]);

  const theme = useTheme();
  return (
    <Card sx={{width: '100%', marginBottom: '5px', backgroundColor: `${theme.palette.primary.main}`, color:'white'}}>
      <CardContent sx={{paddingBottom: "5px"}}>
        <Typography component="h3"><span className="movieHeader">Movie title:</span></Typography>
        {dupeError ? (
          <Alert sx={{width: "100%"}} key={movie.id} severity="error">Selected movie is already in your watchlist!</Alert>
        ): ''}
        <TextField
          select
          disabled={inEdit ? false : true}
          focused
          fullWidth
          id="movieId"
          defaultValue={movie.id}
          sx={{backgroundColor: 'white', borderRadius: "6px"}}
          onChange={handleMovie}
        >
          {movies.map((movie) =>{ 
            return (<MenuItem value={movie.id} key={movie.id}>{movie.title}</MenuItem>);
          })}
        </TextField>
        <Typography component="h3"><span className="movieHeader">Watched:</span></Typography>
        <ToggleButton sx={{color: 'white', borderColor: 'white'}} color="primary" onChange={handleWatched} value={watched}>{watched ? ("Watched ") : ("Not watched ")}</ToggleButton>
      </CardContent>
      <CardActions sx={{paddingTop: '0px', justifyContent: 'end'}}>
        <Button size="small" className="containedWhiteBorder" variant="contained" onClick={handleEdit}>{inEdit ? "Save" : "Edit"}</Button>
        {inEdit ? (
          <Button size="small" className="containedWhiteBorder" variant="contained" onClick={handleCancel}>Cancel</Button>
        ) : (
          <Button size="small" className="containedWhiteBorder" variant="contained" onClick={handleRemove}>Delete</Button>
        )
        }
      </CardActions>
    </Card>
  )
});

export default ListItem;