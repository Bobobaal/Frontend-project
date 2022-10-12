import { Container, Grid, TextField, Typography, useTheme, Button, FormControlLabel,
Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Checkbox } from "@mui/material";
import {WatchList as List} from '../components/WatchList';
import { useCallback, useState, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from "../contexts/AuthProvider";
import { useLists } from "../contexts/ListsProvider";
import { useMovies } from "../contexts/MoviesProvider";

export default function WatchList(){
  const theme = useTheme();
  const {tokenValid, user} = useSession();
  const {createOrUpdateListItem, listItems} = useLists();
  const {movies} = useMovies();
  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMovieId, setDialogMovieId] = useState('none');
  const [dialogWatched, setDialogWatched] = useState(false);
  const [dialogError, setDialogError] = useState(false);

  const handleInputSearch = useCallback((e) => {
    setSearchValue(e.target.value)
  }, []);

  const filteredMovies = useMemo(() => {
    const listItemsOnlyMovieIds = listItems.map((i) => i.movie.id);
    return movies.filter((m) => !listItemsOnlyMovieIds.includes(m.id));
  }, [movies, listItems]);

  const handleSearch = useCallback(async () => {
    const {stillValid} = await tokenValid()
    if(stillValid) setSearch(searchValue);
  }, [searchValue, tokenValid]);

  const handleOpenDialog = useCallback(async () => {
    const {stillValid} = await tokenValid()
    if(stillValid) setDialogOpen(true)
  }, [tokenValid, setDialogOpen]);

  const handleCancel = useCallback(async () => {
    setDialogOpen(false);
    setDialogMovieId('none');
    setDialogWatched(false);
    await tokenValid();
  }, [setDialogOpen, tokenValid]);

  const handleDialogMovie = useCallback((e) => {
    setDialogMovieId(e.target.value);
  }, [setDialogMovieId])

  const handleDialogWatched = useCallback((e) => {
    setDialogWatched(e.target.checked);
  }, [setDialogWatched])

  const handleAddMovie = useCallback(async () => {
    if((dialogMovieId === 'none' )){
      setDialogError(true);
    }else{
      setDialogError(false);
      setDialogOpen(false);
    }
    const {stillValid} = await tokenValid();
    if(stillValid && (dialogMovieId !== 'none')){
      createOrUpdateListItem({movieId: dialogMovieId, userId: user.id, watched: dialogWatched})
    }
  }, [tokenValid, dialogMovieId, user, dialogWatched, createOrUpdateListItem, setDialogOpen, setDialogError]);

  return (
    <Container component="main" sx={{
      width: '75%',
      backgroundColor: '#d9d9d9',
      marginTop: '30px',
      marginBottom: '15px',
      paddingTop: '20px',
      paddingBottom: '20px',
      borderRadius: '50px',
    }}>
      <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
        <Typography component="h1" variant="h4"
        sx={{
            backgroundColor: `${theme.palette.primary.main}`,
            paddingLeft: '5px',
            paddingRight: '5px',
            marginBottom: '5px',
            color: 'white',
            borderRadius: '4px'
          }}>
          <FontAwesomeIcon icon={["fas", "list-alt"]}/>
          <> Your watchlist</>
        </Typography>
        <Grid item container sx={{padding: '0px', marginBottom: '5px'}}>
          <Grid item xs={8}>
            <TextField
              sx={{width: '99%', backgroundColor: 'white'}}
              type="search"
              value={searchValue}
              onChange={handleInputSearch}
              size="small"
              focused
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              className="buttonTrusted"
              variant="contained"
              onClick={handleSearch}
            >Search</Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              className="buttonTrusted"
              variant="contained"
              onClick={handleOpenDialog}
            >Add movie</Button>
          </Grid>
        </Grid>
        <List search={search}/>
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Select a movie to add to your watchlist</DialogTitle>
        <DialogContent sx={{paddingTop: "8px!important"}}>
        <TextField
          select
          error={dialogError}
          focused
          fullWidth
          id="movieId"
          defaultValue="none"
          label="Movie"
          onChange={handleDialogMovie}
          helperText={dialogError ? "Please select a movie" : ""}
        >
          <MenuItem value="none" key="none">No movie selected</MenuItem>
          {filteredMovies.map((movie) =>{ 
            return (<MenuItem value={movie.id} key={movie.id}>{movie.title}</MenuItem>);
          })}
        </TextField>
        <FormControlLabel label="Watched" control={<Checkbox sx={{color: "black"}} checked={dialogWatched} onChange={handleDialogWatched} />} />
        </DialogContent>
        <DialogActions>
          <Button className="buttonTrusted" onClick={handleAddMovie}>Add movie</Button>
          <Button className="buttonTrusted" onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};