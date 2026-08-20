import { useEffect, useState } from 'react';
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Login/LoginPage';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthTokens,
  getAuthTokens,
  login,
  logout,
  refresh,
} from './services/auth';

const AUTHENTICATED_ROUTES = ['/home', '/zones', '/alerts/new'] as const;

function isAuthenticatedRoute(path: string): path is (typeof AUTHENTICATED_ROUTES)[number] {
  return AUTHENTICATED_ROUTES.includes(path as (typeof AUTHENTICATED_ROUTES)[number]);
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAuthTokens()?.accessToken));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      navigate('/');
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'auth_tokens' && !event.newValue) {
        setIsAuthenticated(false);
        navigate('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
      window.removeEventListener('storage', handleStorage);
    };
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
    if (!isBootstrapping && isAuthenticatedRoute(pathname) && !isAuthenticated) {
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

  if (isAuthenticated && isAuthenticatedRoute(pathname)) {
    return (
      <HomePage
        currentPath={pathname}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  if (isAuthenticated && pathname === '/') {
    navigate('/home');
    return null;
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
