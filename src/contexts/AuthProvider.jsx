import { createContext, useMemo, useState, useCallback, useEffect, useContext } from 'react';
import * as usersApi from '../api/user';
import * as api from '../api';
import config from '../config.json';

const JWT_TOKEN_KEY = config.token_key;
const AuthContext = createContext();

function parseJwt(token) {
  if (!token) return {};
  const base64Url = token.split('.')[1];
  const payload = Buffer.from(base64Url, 'base64');
  const jsonPayload = payload.toString('ascii');
  return JSON.parse(jsonPayload);
}

function parseExp(exp) {
  if (!exp) return null;
  if (typeof exp !== 'number') exp = Number(exp);
  if (isNaN(exp)) return null;
  return new Date(exp*1000);
}

const useAuth = () => useContext(AuthContext);

export const useSession = () => {
  const { stateToken, user, ready, loading, error, hasRole, tokenValid } = useAuth();
  return {
    stateToken,
    user,
    ready,
    error,
    loading,
    isAuthed: Boolean(stateToken),
    hasRole,
    tokenValid
  };
};

export const useLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export const useRegister = () => {
  const { register } = useAuth();
  return register;
};

export const AuthProvider = ({children}) => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stateToken, setStateToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [user, setUser] = useState(null);

  const tokenValid = useCallback(async (token = stateToken) => {
    const { exp, userId } = parseJwt(token);
    const expiry = parseExp(exp);
    const stillValid = expiry >= new Date();

    if (stillValid) {
      localStorage.setItem(JWT_TOKEN_KEY, token);
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem("userId");
      token = null;
    }

    api.setAuthToken(token);
    setStateToken(token);
    setReady(token && stillValid);

    return {stillValid, userId};
  }, [stateToken])

  const setSession = useCallback(async (token, user) => {
    const {stillValid, userId} = await tokenValid(token);
    if (!user && stillValid) {
      user = await usersApi.getUserById(userId);
    }
    setUser(user);
  }, [tokenValid]);

  useEffect(() => {
    setSession(stateToken);
  }, [stateToken, setSession]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { token, user } = await usersApi.login(email, password);
      await setSession(token, user);
      return true;
    } catch (error) {
      setError('Login failed, try again');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const { token, user } = await usersApi.register(data);
      await setSession(token, user);
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  const logout = useCallback(() => {
    setSession(null, null);
  }, [setSession]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.roles.includes(role);
  }, [user]);

  const value = useMemo(() => ({
    stateToken,
    user,
    ready,
    loading,
    error,
    login,
    logout,
    register,
    hasRole,
    tokenValid
  }), [stateToken, user, ready, loading, error, login, logout, register, hasRole, tokenValid]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};