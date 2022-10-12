import { useHistory } from "react-router-dom";
import { Container, Grid, TextField, Typography, useTheme, Button } from "@mui/material";
import MovieList from '../components/MovieList';
import {useState} from 'react';
import { useCallback } from "react";
import { useSession } from "../contexts/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Movies(){
  const history = useHistory();
  const theme = useTheme();
  const {hasRole, tokenValid} = useSession();
  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState('');

  const handleInputSearch = useCallback((e) => setSearchValue(e.target.value), []);
  const handleSearch = useCallback(async () => {
    const {stillValid} = await tokenValid();
    if(stillValid) setSearch(searchValue);
  }, [searchValue, tokenValid]);

  const handleAdd = useCallback(() => {
    history.push('/movies/add')
  }, [history]);

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
          <FontAwesomeIcon icon={["fas", "film"]}/>
          <> Movies</>
        </Typography>
        <Grid item container sx={{padding: '0px', marginBottom: '5px'}}>
          <Grid item xs={8}>
            <TextField
              sx={{width: '99%', backgroundColor: 'white'}}
              type="search"
              value={searchValue}
              data-cy="movies_search_txtfield"
              onChange={handleInputSearch}
              size="small"
              focused
            />
          </Grid>
          <Grid item xs={hasRole('trusted') ? 2 : 4}>
            <Button
              className={hasRole("trusted") ? "buttonTrusted" : "searchButtonNotTrusted"}
              variant="contained"
              data-cy="movies_search_btn"
              onClick={handleSearch}
            >Search</Button>
          </Grid>
          {hasRole('trusted') ? 
          (
            <Grid item xs={2}>
              <Button
                className="buttonTrusted"
                variant="contained"
                onClick={handleAdd}
              >Add movie</Button>
            </Grid>
          ) : ''}
        </Grid>
        <MovieList search={search}/>
      </Grid>
    </Container>
  );
};