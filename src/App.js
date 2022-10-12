import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Theme from './material/Theme';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

//Contexts imports
import {AuthProvider} from './contexts/AuthProvider';
import {ListsProvider} from './contexts/ListsProvider';
import {MoviesProvider} from './contexts/MoviesProvider';

//Components imports
import NavMenu from './components/NavMenu';
import PrivateRoute from './components/PrivateRoute';

//Pages imports
import Login from './Pages/Login';
import Register from './Pages/Register';
import Movies from './Pages/Movies';
import MoviesForm from './Pages/MoviesForm';
import Watchlist from './Pages/Watchlist';

library.add(fab, fas);

function App() {
  return (
    <Theme>
      <AuthProvider>
        <MoviesProvider>
          <ListsProvider>
            <Router>
              <NavMenu />
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/login" />
                </Route>
                  
                <PrivateRoute path="/movies" exact>
                  <Movies />
                </PrivateRoute>

                <PrivateRoute role="trusted" path="/movies/add" exact>
                  <MoviesForm />
                </PrivateRoute>

                <PrivateRoute role="trusted" path="/movies/edit/:id" exact>
                  <MoviesForm />
                </PrivateRoute>

                <PrivateRoute path="/watchlist/:userId" exact>
                  <Watchlist />
                </PrivateRoute>

                <Route path="/login" exact>
                  <Login />
                </Route>

                <Route path="/register" exact>
                  <Register />
                </Route>

                <Route path="*">
                  <Redirect to="/login" />
                </Route>
              </Switch>
            </Router>
          </ListsProvider>
        </MoviesProvider>
      </AuthProvider>
    </Theme>
  );
}

export default App;
