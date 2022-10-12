import { useCallback } from "react";
import { useLogout, useSession } from "../contexts/AuthProvider";
import {AppBar, Box, Toolbar, Typography, Button, Link} from '@mui/material'
import { useHistory } from "react-router-dom";

export default function NavMenu() {
  const { isAuthed } = useSession();
  const history = useHistory();
  const logout = useLogout();

  const handleLogin = useCallback(async () => {
    history.push("/login");
  }, [history])

  const handleRegister = useCallback(async () => {
    history.push("/register");
  },[history])

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isAuthed ? (
              <>
                <Link href="/movies" underline="none"><Button color="inherit" sx={{border: '1px solid white', color:"white"}}>Movies</Button></Link>
                <Link href={`/watchlist/${localStorage.getItem("userId")}`} underline="none"><Button color="inherit" sx={{border: '1px solid white', marginLeft: "5px", color:"white"}}>My watchlist</Button></Link>
              </>
            ) : (
              <></>
            )}
          </Typography>
          {!isAuthed ? (
            <>
              <Button color="inherit" sx={{border: '1px solid white'}}onClick={handleLogin}>Sign In</Button>
              <Button color="inherit" sx={{border: '1px solid white', marginLeft: "5px"}}onClick={handleRegister}>Register</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout} sx={{border: '1px solid white'}}>Sign Out</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}