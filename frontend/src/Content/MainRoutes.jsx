import { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loading from '../Admin/Components/Loading';
import Notification from '../Utils/Notification';
import { APIGetTheme } from '../API/APISystem';
import { ThemeComponentLoader } from '../Utils/ThemeComponentLoader';
import PostOrPageWrapper from '../Utils/PostOrPageWrapper';
import { getWebSocket } from '../Includes/WebSocketClient';
import { handleComponentError } from '../Utils/ErrorHandler';

const THEME_CACHE_KEY = 'app:theme';


const MainRoutes = () => {
  const [components, setComponents] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem(THEME_CACHE_KEY) || null);
  const [loaded, setLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();

  const loadTheme = async () => {
    try {
      const data = await APIGetTheme();
      if (data.status === 200) {
        const themeName = data.data.getTheme.name;
        if (themeName !== theme) {
          localStorage.setItem(THEME_CACHE_KEY, themeName);
          setTheme(themeName);
          window.location.reload();
        }
      }
    } catch (err) {
      await handleComponentError(err, 'MainRoutes', 'loadTheme');
    }
  };

  useEffect(() => {
    if (!theme) {
      loadTheme();
      return;
    }

    const loadComponents = async () => {
      try {
        const comps = await ThemeComponentLoader(theme);
        setComponents(comps);
        setLoaded(true);
      } catch (err) {
        await handleComponentError(err, 'MainRoutes', 'loadComponents');
        await loadTheme();
      }
    };

    loadComponents();
  }, [theme]);

  useEffect(() => {
    const ws = getWebSocket();
    if (!ws) return;

    const handleMessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_THEME') {
          await loadTheme();
        }
      } catch (err) {
        await handleComponentError(err, 'MainRoutes', 'handleWebSocketMessage');
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [theme]);

  // Fade in on route changes
  useEffect(() => {
    setFadeIn(false);
    const id = setTimeout(() => setFadeIn(true), 20); // small delay for transition
    return () => clearTimeout(id);
  }, [location.pathname]);

  // Safely extract components for JSX
  const HomePage = components?.HomePage;
  const PostPage = PostOrPageWrapper;
  const AuthorPage = components?.Author;
  const CategoryPage = components?.Category;
  const SignUpPage = components?.SignUp;
  const LoginPage = components?.Login;

  return (
    <div className="relative min-h-screen">
      {/* Loading overlay */}
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-500 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Loading />
      </div>

      {/* Page content */}
      <Suspense fallback={<Loading />}>
        <div
          className={`transition-opacity duration-500 ${
            loaded && fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Notification />
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={HomePage ? <HomePage /> : <Loading />} />
            <Route path="/author/:id" element={AuthorPage ? <AuthorPage /> : <Loading />} />
            <Route path="/category/:categoryName" element={CategoryPage ? <CategoryPage /> : <Loading />} />
            <Route path="/sign-up" element={SignUpPage ? <SignUpPage /> : <Loading />} />
            <Route path="/login" element={LoginPage ? <LoginPage /> : <Loading />} />
            <Route
              path="/:post_name"
              element={PostPage && components ? <PostPage theme={theme} components={components} /> : <Loading />}
            />
          </Routes>
        </div>
      </Suspense>
    </div>
  );
};

export default MainRoutes;
