import { useEffect, useState } from 'react';
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Login/LoginPage';

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  if (pathname === '/home') {
    return <HomePage />;
  }

  return <LoginPage onLoginSuccess={() => navigate('/home')} />;
}

export default App;
