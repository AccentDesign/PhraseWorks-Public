import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetDashboardAtAGlanceData, APIGetTheme, APILogError } from '../../../API/APISystem';
import { Link } from 'react-router-dom';
import { getWebSocket } from '../../../Includes/WebSocketClient';

const THEME_CACHE_KEY = 'app:admin_theme';

const AtAGlance = () => {
  const { loginPassword } = useContext(APIConnectorContext);

  const [version, setVersion] = useState('');
  const [posts, setPosts] = useState(0);
  const [pages, setPages] = useState(0);
  const [comments, setComments] = useState(0);

  const [theme, setTheme] = useState(() => {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  const fetchStats = async () => {
    const data = await APIGetDashboardAtAGlanceData(loginPassword);
    if (data.status === 200) {
      const stats = data.data.getDashboardAtAGlanceData;
      setVersion(stats.version);
      setPosts(stats.posts);
      setPages(stats.pages);
      setComments(stats.comments);
    }
  };

  const fetchTheme = async () => {
    const themeData = await APIGetTheme(loginPassword);
    if (themeData.status === 200) {
      localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(themeData.data.getTheme));
      setTheme(themeData.data.getTheme);
    }
  };

  useEffect(() => {
    fetchStats();

    if (!theme) fetchTheme();

    const ws = getWebSocket();
    if (!ws) return;

    const handleMessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_THEME') {
          await fetchTheme();
        }
      } catch (err) {
        await APILogError(err.stack || String(err));
        console.error('Failed to handle WebSocket message:', err);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [theme, loginPassword]);

  return (
    <div className="dashboard-item-block">
      <h3 className="font-bold text-lg">At A Glance</h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-y-4">
        <p className="w-1/2">
          <Link to="/admin/posts" className="flex-center-2 block">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
              className="dashboard-item-block-icon w-4 h-4"
            >
              <path d="M497.94 74.17l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.75 18.75-49.15 0-67.91zm-246.8-20.53c-15.62-15.62-40.94-15.62-56.56 0L75.8 172.43c-6.25 6.25-6.25 16.38 0 22.62l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l101.82-101.82 22.63 22.62L93.95 290.03A327.038 327.038 0 0 0 .17 485.11l-.03.23c-1.7 15.28 11.21 28.2 26.49 26.51a327.02 327.02 0 0 0 195.34-93.8l196.79-196.79-82.77-82.77-84.85-84.85z"></path>
            </svg>
            {posts} Post{posts > 0 && posts > 1 ? 's' : ''}
          </Link>
        </p>
        <p className="w-1/2">
          <Link to="/admin/pages" className="flex-center-2 block">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
              className="dashboard-item-block-icon w-4 h-4"
            >
              <path d="M312 155h91c2.8 0 5-2.2 5-5 0-8.9-3.9-17.3-10.7-22.9L321 63.5c-5.8-4.8-13-7.4-20.6-7.4-4.1 0-7.4 3.3-7.4 7.4V136c0 10.5 8.5 19 19 19z"></path>
              <path d="M267 136V56H136c-17.6 0-32 14.4-32 32v336c0 17.6 14.4 32 32 32h240c17.6 0 32-14.4 32-32V181h-96c-24.8 0-45-20.2-45-45z"></path>
            </svg>
            {pages} Page{pages > 0 && pages > 1 ? 's' : ''}
          </Link>
        </p>
        <p className="w-full">
          <Link to="/admin/comments" className="flex-center-2 block">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
              className="dashboard-item-block-icon w-4 h-4"
            >
              <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path>
            </svg>
            {comments} Comment{comments > 0 && comments > 1 ? 's' : ''}
          </Link>
        </p>
      </div>
      <hr className="my-4" />
      <p>
        PhraseWorks {version} running{' '}
        <Link to="/admin/appearance" className="link">
          {theme?.name}
        </Link>{' '}
        theme.
      </p>
    </div>
  );
};

export default AtAGlance;
