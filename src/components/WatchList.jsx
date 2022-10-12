import { Grid, Typography, CircularProgress, Card, CardContent, useTheme} from "@mui/material";
import { useLists } from "../contexts/ListsProvider";
import ListItem from "./ListItem";
import { useMemo } from "react";
import ErrorMessage from "./ErrorMessage";

export function WatchList({search}) {
  const {listItems, error, loading} = useLists();
  const theme = useTheme();

  const filteredListItems = useMemo(() => {
    return listItems.filter((l) => {
      return l.movie.title.toLowerCase().includes(search.toLowerCase())
    });
  }, [listItems, search]);

  if(loading){
    return (
      <Grid item xs={7}>
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

  if(!listItems || !listItems.length){
    return (
      <Card sx={{backgroundColor: `${theme.palette.primary.main}`, color:'white', width: '100%'}}>
        <CardContent>
          <Typography>You have no movies in your watchlist!<br />Add one by clicking the button under a movie on the movies page!</Typography>
        </CardContent>
      </Card>
    )
  }

  return filteredListItems.map((item) => {
    return (<ListItem key={item.id} {...item} />);
  })
}