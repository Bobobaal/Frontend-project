import { useHistory } from "react-router-dom";
import { Grid, Typography, CircularProgress, Card, CardContent, CardActions, Button, useTheme} from "@mui/material";
import { useMovies } from "../contexts/MoviesProvider";
import Movie from "./Movie";
import { useCallback, useMemo } from "react";
import ErrorMessage from "./ErrorMessage";

export default function MovieList({search}) {
  const history = useHistory();
  const {movies, error, loading} = useMovies();
  const theme = useTheme();

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      return m.title.toLowerCase().includes(search.toLowerCase())
    });
  }, [movies, search]);

  const handleAdd = useCallback(() => {
    history.push('/movies/add')
  }, [history]);

  if(loading){
    return (
      <Grid item xs={7} data-cy="movie_loading">
        <Typography component="h2" variant="h5">
          <CircularProgress color='primary'/> Loading...
        </Typography>
      </Grid>
    );
  }

  if(error){
    return (
      <Grid item xs={7}>
        <ErrorMessage error={error} />
      </Grid>
    )
  }

  if(!movies || !movies.length){
    return (
      <Card sx={{backgroundColor: `${theme.palette.primary.main}`, color:'white', width: '100%'}}>
        <CardContent>
          <Typography>There are no movies!<br />Add one by clicking the button below!</Typography>
        </CardContent>
        <CardActions sx={{justifyContent: 'center'}}>
          <Button size="small" onClick={handleAdd} className="containedWhiteBorder" variant="contained">Add Movie</Button>
        </CardActions>
      </Card>
    )
  }

  return filteredMovies.map((movie) => {
    return (<Movie key={movie.id} {...movie} />);
  })
}