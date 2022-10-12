import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useMovies } from "../contexts/MoviesProvider";
import {TextField, Box, Button, Typography, Container, CircularProgress, Grid} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useSession } from "../contexts/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MoviesForm() {
  const {id} = useParams();
  const history = useHistory();
  const {loading, tokenValid} = useSession();
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date());
  const [synopsis, setSynopsis] = useState('');
  const [imdbLink, setImdbLink] = useState('');
  const [imdbLinkError, setImdbLinkError] = useState(false);
  const { currentMovie, setMovieToUpdate, createOrUpdateMovie } = useMovies();

  const handleTitleChange = useCallback((e) => setTitle(e.target.value), [])
  const handleReleaseYearChange = useCallback((value) => setReleaseYear(value), [])
  const handleSynopsisChange = useCallback((e) => setSynopsis(e.target.value), [])
  const handleImdbLinkChange = useCallback((e) => setImdbLink(e.target.value), [])

  useEffect(() => {
    if(currentMovie && (Object.keys(currentMovie).length !== 0 || currentMovie.constructor !== Object)){
      setTitle(currentMovie.title);
      setReleaseYear(new Date(currentMovie.releaseYear,1,1));
      setSynopsis(currentMovie.synopsis);
      setImdbLink(currentMovie.imdbLink);
    }
  }, [currentMovie, setTitle, setReleaseYear, setSynopsis, setImdbLink]);

  useEffect(() => {
    setMovieToUpdate(id);
  }, [id, setMovieToUpdate]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if(tokenValid()){
      try{
        if(imdbLink.length < 29) throw new Error();
        const imdbLinkWithoutNumbers = imdbLink.substring(0,29);
        //(Complained about the \/ whilst they are needed)
        //eslint-disable-next-line
        if(!(imdbLinkWithoutNumbers.match("(?:http:\/\/|https:\/\/)?(?:www\.)?(?:imdb.com\/title\/)?(tt)"))) throw new Error();
        const intReleaseYear = parseInt(releaseYear.getFullYear().toString());
        await createOrUpdateMovie({id: currentMovie?.id, title, releaseYear: intReleaseYear, synopsis, imdbLink});
        setMovieToUpdate(null);
        history.push('/movies');
      }catch(error){
        setImdbLinkError(true);
      }
    }
  }, [createOrUpdateMovie, currentMovie?.id, setMovieToUpdate, history, title, releaseYear, synopsis, imdbLink, tokenValid]);

  return (
    <Container component="main" sx={{width: '50%'}}>
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
          <FontAwesomeIcon icon={["fas", "film"]}/>
          <> {currentMovie?.id ? "Edit " : "Add new "} movie</>
          </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                required
                fullWidth
                id="title"
                label="Title"
                type="string"
                value={title}
                onChange={handleTitleChange}
                error={Boolean(false)}
              />
            </Grid>
            <Grid item xs={3}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  label="Year of release"
                  id="releaseYear"
                  required
                  views={['year']}
                  defaultValue={releaseYear}
                  value={releaseYear}
                  error={Boolean(false)}
                  onChange={handleReleaseYearChange}
                  renderInput={(params) => <TextField {...params}/>}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            id="synopsis"
            label="Synopsis"
            type="string"
            value={synopsis}
            onChange={handleSynopsisChange}
            error={Boolean(false)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="imdbLink"
            label="IMDB Link"
            type="string"
            value={imdbLink}
            onChange={handleImdbLinkChange}
            error={Boolean(imdbLinkError)}
            helperText={Boolean(imdbLinkError) ? 'Not a valid IMDB Link' : ""}
          />
          <div className="flex flex-row justify-end">
            {loading ? (
              <>
                <CircularProgress color='primary'/>
              </>
            ):(
              <>
                <Button type="submit" variant="contained">{currentMovie?.id ? "Save movie" : "Add movie"}</Button>
                <Button type="button" variant="contained" sx={{marginLeft: "2px"}}>
                  <Link to="/Movies">Cancel</Link>
                </Button>
              </>
            )}
          </div>
        </Box>
      </Box>
    </Container>
  );
};