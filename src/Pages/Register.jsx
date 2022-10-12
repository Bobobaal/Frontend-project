import { useCallback, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { useRegister, useSession } from '../contexts/AuthProvider';
import {TextField, Box, Button, Typography, Container,
CircularProgress, Alert, Tooltip, Zoom } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Register() {
  const history = useHistory();
  const register = useRegister();
  const { loading, error, isAuthed } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passTT, setPassTT] = useState(false);
  const [cpassTT, setCPassTT] = useState(false);

  const handleRegister = useCallback(async (event) => {
    event.preventDefault()
    let success = false;
    if(password === confirmPass){
      success = await register({
        username,
        email,
        password
      });
      console.log(JSON.parse(JSON.stringify(error)))
    }else{

    }

    if (success) {
      history.replace(`/watchlist/${localStorage.getItem("userId")}`);
    }
  }, [history, register, username, email, password, confirmPass, error]);

  const handleUsernameChange = useCallback((e) => setUsername(e.target.value), []);
  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const handleConfirmPassChange = useCallback((e) => setConfirmPass(e.target.value), []);
  const handlePassTT = useCallback(() => setPassTT(!passTT), [setPassTT, passTT]);
  const handlecPassTT = useCallback(() => setCPassTT(!cpassTT), [setCPassTT, cpassTT]);

  const handleCancel = useCallback(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPass('');
  }, [setUsername, setEmail, setPassword, setConfirmPass]);

  if (isAuthed) {
    return <Redirect from="/register" to={`/watchlist/${localStorage.getItem("userId")}`} />
  }

  return (
    <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
          <FontAwesomeIcon icon={["fas", "user-lock"]} />
          <> Register</>
          </Typography>
        <Box component="form" onSubmit={handleRegister}>
          {
            error && (JSON.parse(JSON.stringify(error)).status === 500) ? (
              <Alert severity="error">
                User with the same username or email already exists!
              </Alert>
            ) : error && (JSON.parse(JSON.stringify(error)).status === 400) ? (
              <Alert severity="error">
                Make sure your password consists of:
                <ul>
                  <li>Atleast 1 lowercase character [a-z]</li>
                  <li>Atleast 1 uppercase character[A-Z]</li>
                  <li>Atleast 1 number [0-9]</li>
                  <li>Atleast 1 symbol </li>
                  <li>Length between 8 - 30 characters</li>
                </ul>
              </Alert>
            ) : ''
          }
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            type="string"
            value={username}
            onChange={handleUsernameChange}
            error={Boolean(error)}
            placeholder="RandomUser420"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            error={Boolean(error)}
            placeholder="example@hotmail.com"
          />
          <Tooltip placement="right-start" TransitionComponent={Zoom} open={passTT} arrow title={
            <>
              Make sure your password consists of:
                <ul>
                  <li>Atleast 1 lowercase character [a-z]</li>
                  <li>Atleast 1 uppercase character[A-Z]</li>
                  <li>Atleast 1 number [0-9]</li>
                  <li>Atleast 1 symbol </li>
                  <li>Length between 8 - 30 characters</li>
                </ul>
            </>
          }>
            <TextField
              margin="normal"
              required
              fullWidth
              onFocus={handlePassTT}
              onBlur={handlePassTT}
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(error) || !(password === confirmPass)}
              helperText={password === confirmPass ? '' : "Passwords do not match"}
            />
          </Tooltip>
          <Tooltip placement="right-start" TransitionComponent={Zoom} open={cpassTT} arrow title={
            <>
              Make sure your password consists of:
                <ul>
                  <li>Atleast 1 lowercase character [a-z]</li>
                  <li>Atleast 1 uppercase character[A-Z]</li>
                  <li>Atleast 1 number [0-9]</li>
                  <li>Atleast 1 symbol </li>
                  <li>Length between 8 - 30 characters</li>
                </ul>
            </>
          }>
            <TextField
              margin="normal"
              required
              fullWidth
              onFocus={handlecPassTT}
              onBlur={handlecPassTT}
              id="confPassword"
              label="Confirm password"
              type="password"
              value={confirmPass}
              onChange={handleConfirmPassChange}
              error={Boolean(error) || !(password === confirmPass)}
              helperText={password === confirmPass ? '' : "Passwords do not match"}
            />
          </Tooltip>
          <div className="flex flex-row justify-end">
            {loading ? (
              <>
                <CircularProgress color='primary'/>
              </>
            ):(
              <>
                <Button type="submit" variant="contained" disabled={Boolean(!(password === confirmPass))}>Register</Button>
                <Button type="button" variant="contained" sx={{marginLeft: "2px"}} onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Box>
      </Box>
    </Container>
  );
}