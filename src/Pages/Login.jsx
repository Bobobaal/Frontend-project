import { useCallback, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {TextField, Box, Button, Typography, Container, Alert} from '@mui/material';
import { useLogin, useSession } from '../contexts/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, isAuthed } = useSession();
  const login = useLogin();

  const handleLogin = useCallback(async (event) => {
    event.preventDefault();
    const success = await login(email, password);

    if (success) {
      history.replace(`/watchlist/${localStorage.getItem("userId")}`);
    }
  }, [history, login, email, password]);

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  if (isAuthed) {
    return <Redirect from="/login" to={`/watchlist/${localStorage.getItem("userId")}`} />
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
          <> Sign in</>
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          {
            error ? (
              <Alert severity="error">
              {error}
              </Alert>
            ) : null
          }
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            type="email"
            data-cy="email_input"
            value={email}
            onChange={handleEmailChange}
            error={Boolean(error)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            data-cy="password_input"
            value={password}
            onChange={handlePasswordChange}
            error={Boolean(error)}
          />
          <div className="flex flex-row justify-end">
            {loading ? (
              <>
                <CircularProgress color='primary'/>
              </>
            ):(
              <>
                <Button type="submit" data-cy="submit_btn" variant="contained">Sign In</Button>
              </>
            )}
          </div>
        </Box>
      </Box>
    </Container>
  )
};