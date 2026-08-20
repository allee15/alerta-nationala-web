import { useEffect, useState } from 'react';
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Login/LoginPage';
import {
  clearAuthTokens,
  getAuthTokens,
  login,
  logout,
  refresh,
} from './services/auth';

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuthTokens()?.accessToken));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const tokens = getAuthTokens();

      if (!tokens?.refreshToken) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        await refresh();
        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch {
        clearAuthTokens();
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isBootstrapping && pathname === '/home' && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isBootstrapping, pathname]);

  const handleLogin = async (email: string, password: string) => {
    await login({ email, password });
    setIsAuthenticated(true);
    navigate('/home');
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  if (isBootstrapping) {
    return null;
  }

  if (pathname === '/home' && isAuthenticated) {
    return <HomePage onLogout={handleLogout} />;
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
