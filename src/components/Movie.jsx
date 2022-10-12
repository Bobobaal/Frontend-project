import { Typography, Card, CardContent, useTheme, Link, CardActions, Button } from "@mui/material";
import {memo, useCallback} from 'react'
import { useHistory } from 'react-router-dom'
import { useMovies } from "../contexts/MoviesProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from "../contexts/AuthProvider";

const Movie = memo(({id, title, releaseYear, synopsis, imdbLink}) => {
  const history = useHistory();
  const {hasRole, tokenValid} = useSession();
  const {deleteMovie} = useMovies();

  const handleRemove = useCallback(async () => {
    const {stillValid} = await tokenValid();
    if(stillValid) deleteMovie(id);
  }, [deleteMovie, id, tokenValid])

  const handleEdit = useCallback(() => {
    history.push(`/movies/edit/${id}`);
  }, [history, id])

  const theme = useTheme();
  return (
    <Card data-cy="movie" sx={{width: '100%', marginBottom: '5px', backgroundColor: `${theme.palette.primary.main}`, color:'white'}}>
      <CardContent sx={{paddingBottom: "5px"}}>
        <Typography component="h3"><span className="movieHeader">Title:</span></Typography>
        <Typography data-cy="movie_title">{title}</Typography>
        <Typography component="h3"><span className="movieHeader">Year of release:</span></Typography>
        <Typography data-cy="movie_releaseYear">{releaseYear}</Typography>
        <Typography component="h3"><span className="movieHeader">Movie synopsis:</span></Typography>
        <Typography data-cy="movie_synopsis">{synopsis}</Typography>
        <Typography var="h3"><span className="movieHeader"><FontAwesomeIcon icon={["fab", "imdb"]}/> Link to IMDB page:</span></Typography>
        <Link href={`${imdbLink}`} sx={{color: 'white'}} target="_blank" rel="noreferrer" data-cy="movie_imdbLink">{title} <FontAwesomeIcon icon={["fas", "link"]}/></Link>
      </CardContent>
      {hasRole("trusted") || hasRole("admin") ? (
        <CardActions sx={{paddingTop: '0px', justifyContent: 'end'}}>
          <Button size="small" className="containedWhiteBorder" variant="contained" onClick={handleEdit}>Edit</Button>
          {hasRole("admin") ? (
            <Button size="small" className="containedWhiteBorder" variant="contained" onClick={handleRemove}>Delete</Button>
          ):''}
        </CardActions>
      ):''}
    </Card>
  )
});

export default Movie;